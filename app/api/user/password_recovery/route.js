import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import bcrypt from 'bcryptjs';

const OAuth2 = google.auth.OAuth2;

export const POST = async (req) =>{
  const { email } = await req.json();

  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) {
        return new Response('Email not found', { status: 404 });
    }

    // Generate a token
    const token = uuidv4();
    user.resetPasswordToken = token;
    // Token expires in 1 hour
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();


    const oauth2Client = new OAuth2(
      process.env.GOOGLE_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${process.env.NEXTAUTH_URL}/reset-password?token=${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    console.log("sent")
    return new Response('Email sent', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal server error', { status: 500 });
  }
}

export const PUT = async (req) => {
  const { token, password } = await req.json();
  console.log(token, password)
  try {
    await connectToDB();

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      console.log("Invalid or expired token")
        return new Response('Invalid or expired token', { status: 400 });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    user.password = hashed_password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return new Response('Password updated', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal server error', { status: 500 });
  }
}
    