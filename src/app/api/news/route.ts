// src/app/api/news/route.ts
import { NextResponse } from "next/server";
import { getNews } from "../../lib/api";

export async function GET() {
  try {
    const news = await getNews();

    if (!news || !Array.isArray(news)) {
      return NextResponse.json({ error: "No news data received" }, { status: 500 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Error in /api/news route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
