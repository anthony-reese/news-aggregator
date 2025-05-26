// filepath:\src\app\api\[...nextauth]\route.ts

import NextAuth from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]"

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
