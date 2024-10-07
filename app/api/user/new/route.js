import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
export const POST = async (request) => {
    const { email, password, username } = await request.json();
    try {
        await connectToDB();
        const user = await User.findOne({ email }); 
        if (user) {
            return new Response("User already exists", { status: 400 });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashed_password, username});
        await newUser.save();
        return new Response("User Created", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}