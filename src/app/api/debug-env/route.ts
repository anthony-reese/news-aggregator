// src/app/api/debug-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_FROM: process.env.EMAIL_FROM,
  });
}
