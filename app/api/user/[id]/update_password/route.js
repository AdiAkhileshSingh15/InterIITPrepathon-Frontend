
import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';

export const PUT = async (req, {params}) => {
    const { oldPassword, newPassword } = await req.json();
    
    try {
        await connectToDB();
    
        const user = await User.findById(params.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return new Response('Invalid password', { status: 401 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return new Response('Password updated', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}