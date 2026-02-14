import { DefaultSession } from "next-auth";
import { Role } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    emailVerified: Date | null;
  }
}
