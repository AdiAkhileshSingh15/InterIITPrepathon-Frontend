import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/user';
import { connectToDB } from '@/utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        console.log("Sign in: ", profile);

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