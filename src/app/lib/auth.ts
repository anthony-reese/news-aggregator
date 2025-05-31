import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "../../lib/prisma";
import { AuthOptions } from "next-auth";
import nodemailer from "nodemailer";
import { magicLinkTemplate } from "../../lib/emailTemplates/magicLinkEmail";

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
        const { html, subject } = magicLinkTemplate(url);
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST!,
          port: Number(process.env.EMAIL_SERVER_PORT!),
          auth: {
            user: process.env.EMAIL_SERVER_USER!,
            pass: process.env.EMAIL_SERVER_PASSWORD!,
          },
        });

        await transporter.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM!,
          subject,
          html,
        });
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  pages: {
    signIn: "/auth",
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
    createUser: async ({ user }) => {
      const defaultName = user.email?.split('@')[0] ?? 'User';
      const capitalized = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      await prisma.user.update({
        where: { id: user.id },
        data: { name: capitalized },
      });
      console.log(`✅ Assigned default name "${defaultName}" to new user`);
    },
  },
  debug: true,
};
