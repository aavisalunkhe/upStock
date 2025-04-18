"use server"

export async function predictStockMovement(ticker, tweets, historicalPrices, lookbackWindow = 14) {
  console.log(`Predicting stock movement for ${ticker} with ${lookbackWindow} days lookback...`)

  const dailySentiment = {}

  tweets.forEach((tweet) => {
    const date = new Date(tweet.date).toISOString().split("T")[0]
    if (!dailySentiment[date]) {
      dailySentiment[date] = {
        tweets: [],
        weightedScore: 0,
      }
    }

    dailySentiment[date].tweets.push(tweet)
  })

  Object.keys(dailySentiment).forEach((date) => {
    dailySentiment[date].weightedScore = calculateWeightedSentiment(dailySentiment[date].tweets)
  })

  const features = []

  historicalPrices.forEach((priceData, index) => {
    if (index < historicalPrices.length - 1) {
      const date = priceData.date
      const sentiment = dailySentiment[date]?.weightedScore || 0

      features.push({
        date,
        price: priceData.price,
        sentiment,
        target: historicalPrices[index + 1].price > priceData.price ? 1 : 0,
      })
    }
  })

  const recentFeatures = features.slice(-lookbackWindow)

  const positiveSentimentDays = recentFeatures.filter((f) => f.sentiment > 0.2).length
  const negativeSentimentDays = recentFeatures.filter((f) => f.sentiment < -0.2).length

  const priceIncreaseDays = recentFeatures.filter((f) => f.target === 1).length

  const sentimentSignal = positiveSentimentDays > negativeSentimentDays ? 1 : -1
  const momentumSignal = priceIncreaseDays > lookbackWindow / 2 ? 1 : -1

  const combinedSignal = sentimentSignal * 0.7 + momentumSignal * 0.3

  return {
    direction: combinedSignal > 0 ? "up" : "down",
    confidence: Math.round(Math.abs(combinedSignal) * 50 + 50),
    date: new Date().toISOString().split("T")[0],
  }
}

function calculateWeightedSentiment(tweets) {
  if (!tweets.length) return 0

  let totalWeight = 0
  let weightedSum = 0

  tweets.forEach((tweet) => {
    const weight = Math.log(tweet.retweets + 1)
    totalWeight += weight
    weightedSum += weight * (tweet.sentimentScore || 0)
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}
