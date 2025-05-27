import { NextRequest, NextResponse } from "next/server";
import { getNews } from "../../lib/api";

export async function GET(req: NextRequest) {
    try {
        // Optional: support category via query string, e.g. /api/news?category=technology
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") || undefined;

        const news = await getNews(category);
        if (!news) {
            return NextResponse.json({ error: "No news data received" }, { status: 500 });
        }
        return NextResponse.json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}