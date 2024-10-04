import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const POST = async (request) => {
    const { email } = await request.json();
    try {
        await connectToDB();
        const user = await User.findOne({ email }); 
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFactorSecret = secret.base32;
        await user.save();

        const otpauthUrl = secret.otpauth_url;
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

        return new Response(JSON.stringify({ qrCode: qrCodeUrl }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}