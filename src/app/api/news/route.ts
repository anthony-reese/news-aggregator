import { NextResponse } from "next/server";
import { getNews } from "../../lib/api";

export async function GET(req: Request) {
    console.log("Request received:", req);

    try {
        const news = await getNews();
        console.log("Fetched news:", news);

        if (!news) {
            throw new Error("No news data received");
        }

        return NextResponse.json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}