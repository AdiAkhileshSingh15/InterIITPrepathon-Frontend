import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import speakeasy from 'speakeasy';

export const POST = async (request) => {
    const { email, token } = await request.json();

    try {
        await connectToDB();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });

        if (verified) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response("Invalid OTP", { status: 400 });
        }

    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}