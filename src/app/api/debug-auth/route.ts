import { authOptions } from "../../lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, providers: authOptions.providers });
}
