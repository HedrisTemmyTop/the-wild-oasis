import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SessionInterface, UserInterface } from "../interface/interface";
import { createGuest, getGuest } from "./data-service";
// import Google from "next/auth/providers/google";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const authConfig: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }: { auth: SessionInterface }) {
      return auth?.user;
    },
    async signIn({ user }: { user: UserInterface }) {
      try {
        const existingGuest = await getGuest(user.email);
        console.log("existing user", existingGuest);
        if (!existingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name,
          });
          console.log("guest is successfully created");
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session }: { session: SessionInterface }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
