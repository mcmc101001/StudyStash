import NextAuth, { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

type userID = string;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userID;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: userID;
  }
}
