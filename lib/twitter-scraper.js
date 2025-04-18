"use server"
import { cache } from "react"

export const scrapeTweets = cache(async (query, lookbackDays = 14) => {
  console.log(`Scraping tweets for ${query} with ${lookbackDays} days lookback...`)

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - lookbackDays)

  const endDateStr = formatDate(endDate)
  const startDateStr = formatDate(startDate)

  try {
    const mockTweets = generateMockTweets(query, startDateStr, endDateStr, 50)

    console.log(`Generated ${mockTweets.length} mock tweets for ${query}`)
    return mockTweets
  } catch (error) {
    console.error("Error scraping tweets:", error)
    return []
  }
})

function generateMockTweets(query, startDate, endDate, count = 50) {
  const tweets = []
  const ticker = query.replace("$", "").toUpperCase()

  const start = new Date(startDate)
  const end = new Date(endDate)
  const dateRange = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d).toISOString().split("T")[0])
  }

  const authors = [
    "StockTrader123",
    "MarketAnalyst",
    "FinanceGuru",
    "InvestorDaily",
    "WallStreetWhiz",
    `${ticker}Investor`,
    "TradingExpert",
    "MarketMover",
    "StockSage",
    "FinancialFreedom",
    "TechInvestor",
    "ValueHunter",
    "StockPickr",
    "MarketWatcher",
    "TradingView",
    "FinancialTimes",
  ]

  // Bullish tweet templates
  const bullishTemplates = [
    `$${ticker} looking strong today! Support at $PRICE, expecting a breakout soon. #investing`,
    `Just bought more $${ticker}. The fundamentals are solid and the chart looks promising.`,
    `$${ticker} production numbers are impressive this quarter. Could see significant upside.`,
    `$${ticker} is undervalued at current levels. PT: $PRICE by EOY.`,
    `Bullish on $${ticker} after the recent news. This is just the beginning.`,
    `$${ticker} showing strong momentum. Technical indicators all point to a rally.`,
    `$${ticker} earnings will surprise to the upside. Loading up before the announcement.`,
    `The market is underestimating $${ticker}'s growth potential. Strong buy signal.`,
    `$${ticker} breaking out of its consolidation pattern. Time to buy!`,
    `New analyst upgrade for $${ticker}. Price target raised to $PRICE.`,
  ]

  // Bearish tweet templates
  const bearishTemplates = [
    `$${ticker} looking weak at these levels. Resistance at $PRICE is holding strong.`,
    `Just sold my $${ticker} position. The risk/reward no longer makes sense.`,
    `Concerns about $${ticker} competition. Margins might be under pressure next quarter.`,
    `$${ticker} is overvalued at current levels. PT: $PRICE by EOY.`,
    `Bearish on $${ticker} after the recent news. Sell before it drops further.`,
    `$${ticker} showing weakness. Technical indicators point to a pullback.`,
    `$${ticker} earnings will disappoint. Reducing exposure before the announcement.`,
    `The market is overestimating $${ticker}'s growth. Strong sell signal.`,
    `$${ticker} breaking down from support. Time to exit or short.`,
    `New analyst downgrade for $${ticker}. Price target lowered to $PRICE.`,
  ]

  // Neutral tweet templates
  const neutralTemplates = [
    `Watching $${ticker} closely at these levels. No clear direction yet.`,
    `$${ticker} trading sideways. Waiting for a breakout in either direction.`,
    `Mixed signals for $${ticker}. Some positive news but also some concerns.`,
    `Holding my $${ticker} position for now. Will reassess after earnings.`,
    `$${ticker} at a critical juncture. The next few days will be telling.`,
    `Interesting developments at $${ticker}. Need more data before making a move.`,
    `$${ticker} volatility increasing. Could go either way from here.`,
    `Keeping an eye on $${ticker} but not taking a position yet.`,
    `$${ticker} needs to hold $PRICE for the uptrend to continue.`,
    `Neutral on $${ticker} until we get more clarity on the market direction.`,
  ]
  for (let i = 0; i < count; i++) {
    const sentimentRoll = Math.random()
    let template, sentiment

    if (sentimentRoll < 0.5) {
      template = bullishTemplates[Math.floor(Math.random() * bullishTemplates.length)]
      sentiment = "bullish"
    } else if (sentimentRoll < 0.8) {
      template = bearishTemplates[Math.floor(Math.random() * bearishTemplates.length)]
      sentiment = "bearish"
    } else {
      template = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)]
      sentiment = "neutral"
    }

    const basePrice = getBasePrice(ticker)
    const price = (basePrice * (0.9 + Math.random() * 0.2)).toFixed(2)

    const text = template.replace("$PRICE", price)

    const date = dateRange[Math.floor(Math.random() * dateRange.length)]

    const engagementMultiplier = sentiment === "bullish" ? 1.5 : sentiment === "bearish" ? 1.2 : 1

    const retweets = Math.floor(Math.random() * 100 * engagementMultiplier)
    const replies = Math.floor(Math.random() * 30 * engagementMultiplier)
    const likes = Math.floor(Math.random() * 200 * engagementMultiplier)

    tweets.push({
      id: `mock-${i}-${Date.now()}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      text,
      date,
      replies,
      retweets,
      likes,
      url: `https://twitter.com/user/status/mock-${i}`,
      sentiment,
    })
  }

  return tweets.sort((a, b) => new Date(b.date) - new Date(a.date))
}
function getBasePrice(ticker) {
  const priceMap = {
    TSLA: 250,
    AAPL: 180,
    MSFT: 350,
    AMZN: 140,
    GOOGL: 130,
    META: 300,
    NVDA: 450,
    AMD: 120,
    INTC: 40,
    NFLX: 550,
  }

  return priceMap[ticker] || 100 
}

export function preprocessTweet(text) {
  let processed = text.replace(/https?:\/\/\S+/g, "[URL]")

  processed = processed.replace(/#(\w+)/g, "$1")

  processed = processed.replace(/([!?.])\1+/g, "$1")

  return processed
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
