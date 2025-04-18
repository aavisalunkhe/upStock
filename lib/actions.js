"use server"

import { revalidatePath } from "next/cache"
import { scrapeTweets } from "./twitter-scraper"
import { analyzeSentiment, calculateWeightedSentiment } from "./sentiment-analysis"
import { fetchStockPrices } from "./stock-data"
import { predictStockMovement } from "./stock-prediction"
import { cache } from "react"

export const analyzeStock = cache(async (ticker) => {
  console.log(`Analyzing stock ${ticker}...`)

  try {
    const lookbackDays = 14 
    const stockPrices = await fetchStockPrices(ticker, lookbackDays)

    if (!stockPrices.length) {
      throw new Error(`No stock data found for ${ticker}`)
    }

    const tweets = await scrapeTweets(ticker, lookbackDays)

    if (!tweets.length) {
      throw new Error(`No tweets found for ${ticker}`)
    }

    const analyzedTweets = await analyzeSentiment(tweets)
    const tweetsByDay = {}
    analyzedTweets.forEach((tweet) => {
      const date = tweet.date
      if (!tweetsByDay[date]) {
        tweetsByDay[date] = []
      }
      tweetsByDay[date].push(tweet)
    })

    const dailySentiment = {}
    Object.keys(tweetsByDay).forEach((date) => {
      dailySentiment[date] = {
        tweets: tweetsByDay[date],
        count: tweetsByDay[date].length,
        weightedScore: calculateWeightedSentiment(tweetsByDay[date]),
      }
    })

    const combinedData = stockPrices.map((priceData) => {
      const date = priceData.date
      const sentiment = dailySentiment[date]?.weightedScore || 0
      return {
        ...priceData,
        sentiment,
      }
    })
    const prediction = await predictStockMovement(ticker, analyzedTweets, stockPrices, lookbackDays)
    const bullishCount = analyzedTweets.filter((t) => t.sentiment === "bullish").length
    const bearishCount = analyzedTweets.filter((t) => t.sentiment === "bearish").length
    const neutralCount = analyzedTweets.filter((t) => t.sentiment === "neutral").length

    return {
      success: true,
      ticker,
      prediction,
      stockData: combinedData,
      tweets: analyzedTweets,
      sentimentSummary: {
        bullish: bullishCount,
        bearish: bearishCount,
        neutral: neutralCount,
      },
    }
  } catch (error) {
    console.error(`Error analyzing stock ${ticker}:`, error)
    throw error
  }
})

export async function fetchStockData(ticker) {
  try {
    await analyzeStock(ticker)
    revalidatePath(`/dashboard/${ticker}`)
    return { success: true }
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error)
    throw error
  }
}
