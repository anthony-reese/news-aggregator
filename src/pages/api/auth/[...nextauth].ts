// filepath: \news-aggregator\src\pages\api\[...nextauth].ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { prisma } from "../../../lib/prisma";
import nodemailer from 'nodemailer';
import { magicLinkTemplate } from '../../../lib/emailTemplates/magicLinkEmail';

// Example custom email sender function
export async function sendCustomEmail({ email, link }: { email: string; link: string }) {
  const { html, subject } = magicLinkTemplate(link);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html,
  });
  // Implement your custom email logic here (e.g., using nodemailer)
  console.log(`📧 Sending magic login link to ${email}`);
  console.log(`🔗 Magic link: ${link}`);
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
      async sendVerificationRequest({ identifier, url }) {
        // identifier is the user's email
        console.log("🚀 Sending magic link to", identifier);
        await sendCustomEmail({ email: identifier, link: url });
        console.log(`📧 Triggering magic link email for: ${identifier}`);
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  events: {
    createUser: async (message) => {
      console.log("New user created:", message)
    },
  },
  session: {
    strategy: "database",
  },
  debug: true,
};

export default NextAuth(authOptions);