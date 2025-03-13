import { NextResponse } from "next/server";
import { getNews } from "../lib/api";

export async function GET(req: Request) {
    const news = await getNews();
    return NextResponse.json(news);
}