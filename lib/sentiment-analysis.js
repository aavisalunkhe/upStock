"use server"

export async function analyzeSentiment(tweets) {
  console.log(`Analyzing sentiment for ${tweets.length} tweets...`)

  return tweets.map((tweet) => {
    if (tweet.sentiment) {
      return {
        ...tweet,
        sentimentScore: tweet.sentiment === "bullish" ? 0.8 : tweet.sentiment === "bearish" ? -0.8 : 0,
        preprocessedText: preprocessTweet(tweet.text),
      }
    }
    const text = preprocessTweet(tweet.text).toLowerCase()
    let sentiment = "neutral"
    let score = 0
    const bullishTerms = [
      "buy",
      "long",
      "bullish",
      "up",
      "growth",
      "positive",
      "strong",
      "higher",
      "rise",
      "moon",
      "breakout",
      "beat",
      "exceed",
      "outperform",
      "upgrade",
      "rally",
      "gain",
      "profit",
      "success",
      "opportunity",
      "potential",
      "promising",
      "impressive",
      "excellent",
      "good",
      "great",
    ]

    const bearishTerms = [
      "sell",
      "short",
      "bearish",
      "down",
      "drop",
      "negative",
      "weak",
      "lower",
      "fall",
      "crash",
      "decline",
      "decrease",
      "underperform",
      "downgrade",
      "miss",
      "fail",
      "loss",
      "risk",
      "concern",
      "worry",
      "problem",
      "issue",
      "bad",
      "poor",
      "terrible",
      "disappointing",
    ]
    let bullishCount = 0
    let bearishCount = 0

    bullishTerms.forEach((term) => {
      if (text.includes(term)) bullishCount++
    })

    bearishTerms.forEach((term) => {
      if (text.includes(term)) bearishCount++
    })
    if (bullishCount > bearishCount) {
      sentiment = "bullish"
      score = Math.min(bullishCount * 0.2, 1)
    } else if (bearishCount > bullishCount) {
      sentiment = "bearish"
      score = -Math.min(bearishCount * 0.2, 1)
    }

    return {
      ...tweet,
      sentiment,
      sentimentScore: score,
      preprocessedText: preprocessTweet(tweet.text),
    }
  })
}

export function calculateWeightedSentiment(tweets) {
  if (!tweets.length) return 0

  let totalWeight = 0
  let weightedSum = 0

  tweets.forEach((tweet) => {
    const weight = Math.log(tweet.retweets + 1)
    totalWeight += weight
    weightedSum += weight * tweet.sentimentScore
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

function preprocessTweet(text) {
  let processed = text.replace(/https?:\/\/\S+/g, "[URL]")
  processed = processed.replace(/#(\w+)/g, "$1")
  processed = processed.replace(/([!?.])\1+/g, "$1")
  return processed
}
