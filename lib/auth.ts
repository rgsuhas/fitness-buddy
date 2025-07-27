import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/lib/models/user.model';
import { connectToDB } from '@/lib/db';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        await connectToDB();
        try {
          let user = await User.findOne({ email: profile?.email });

          if (!user) {
            user = await User.create({
              email: profile?.email,
              name: profile?.name,
              avatar: profile?.image,
            });
          }
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (session.user) {
        session.user.id = token.sub as string;
        // Fetch user from DB to get role and other details
        await connectToDB();
        const dbUser = await User.findById(token.sub);
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user._id = dbUser._id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add custom properties to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  adapter: MongoDBAdapter(clientPromise),
};
