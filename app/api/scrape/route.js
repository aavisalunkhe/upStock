import { NextResponse } from "next/server"
import { scrapeTweets } from "@/lib/twitter-scraper"
import { analyzeSentiment } from "@/lib/sentiment-analysis"

export async function POST(request) {
  try {
    const { ticker, lookbackDays = 14 } = await request.json()

    if (!ticker) {
      return NextResponse.json({ error: "Stock ticker is required" }, { status: 400 })
    }
    const tweets = await scrapeTweets(ticker, lookbackDays)
    const analyzedTweets = await analyzeSentiment(tweets)

    return NextResponse.json({
      success: true,
      data: analyzedTweets,
    })
  } catch (error) {
    console.error("Error scraping tweets:", error)
    return NextResponse.json({ error: "Failed to scrape tweets" }, { status: 500 })
  }
}
