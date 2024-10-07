import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
// import LinkedIn from 'next-auth/providers/linkedin';

import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import Slack from 'next-auth/providers/slack';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      // Need to hash the password and validation is done here
      async authorize(credentials) {
        console.log("Authorizing credentials: ", credentials);
        try {
          await connectToDB();
          const user = await User.findOne({ email : credentials.email });
          if (!user) {
            throw new Error('Invalid email or password');
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
          return { email: user.email, username: user.username, image: user.image };
        }
        catch (error) {
          console.log("Error authorizing credentials: ", error.message);
          throw new Error('Invalid email or password');
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // LinkedIn({
    //   clientId: process.env.LINKEDIN_ID,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    // }),
    Slack({
      clientId: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.verified2fa = false;

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        console.log("Sign in: ", profile);
        console.log("Credentials: ", credentials);

        if(account?.provider === 'credentials') {
          if(!credentials) {
            return false;
          }
          // check if user exists
          const user = await User.findOne({ email: credentials.email });
          if(!user) {
            return false;
          }
          return true;
        }

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
            let userName = profile.name.replace(/\s+/g, '').toLowerCase();

            if (userName.length < 8) {
                userName = userName.padEnd(8, Math.random().toString(36).substring(2, 3)); // pad to 8 characters
            } else if (userName.length > 20) {
                userName = userName.slice(0, 20);
            }

            // ensure username matches the alphanumeric requirement (based on user schema)
            if (!/^[a-zA-Z0-9._]+$/.test(userName)) {
                userName = userName.replace(/[^a-zA-Z0-9._]/g, ''); // remove any non-alphanumeric characters
            }
            await User.create({
                email: profile.email,
                username: userName,
                image: profile.picture,
            });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }