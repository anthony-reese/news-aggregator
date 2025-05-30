import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "../../lib/prisma"; // adjust path if needed
import { AuthOptions } from "next-auth";
import nodemailer from "nodemailer";
import { magicLinkTemplate } from "../../lib/emailTemplates/magicLinkEmail"; // adjust path

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
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
};
