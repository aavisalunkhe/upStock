"use server"

import axios from "axios"

export async function fetchStockPrices(ticker, lookbackDays = 30) {
  console.log(`Fetching stock prices for ${ticker} with ${lookbackDays} days lookback...`)

  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - (lookbackDays + 5))

    const endDateStr = formatDate(endDate)
    const startDateStr = formatDate(startDate)

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${Math.floor(startDate.getTime() / 1000)}&period2=${Math.floor(endDate.getTime() / 1000)}`

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    const data = response.data

    const result = data.chart.result[0]
    const timestamps = result.timestamp
    const quotes = result.indicators.quote[0]
    const adjclose = result.indicators.adjclose?.[0]?.adjclose || quotes.close

    const prices = timestamps.map((timestamp, i) => {
      const date = new Date(timestamp * 1000).toISOString().split("T")[0]
      return {
        date,
        price: adjclose[i] || quotes.close[i],
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        volume: quotes.volume[i],
      }
    })

    return prices.filter((price) => price.price !== null)
  } catch (error) {
    console.error("Error fetching stock prices:", error)

    return generateMockStockData(ticker, lookbackDays)
  }
}

function generateMockStockData(ticker, days) {
  const basePrice = getBasePrice(ticker)
  const volatility = getVolatility(ticker)
  const prices = []

  const endDate = new Date()
  let currentPrice = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(endDate.getDate() - i)
    const dateStr = formatDate(date)

    const trend = Math.random() > 0.45 ? 1 : -1 
    const change = currentPrice * volatility * trend * Math.random()
    currentPrice += change

    currentPrice = Math.max(currentPrice, 1)

    const dailyHigh = currentPrice * (1 + volatility * 0.5 * Math.random())
    const dailyLow = currentPrice * (1 - volatility * 0.5 * Math.random())
    const openPrice = currentPrice * (1 + volatility * 0.2 * (Math.random() - 0.5))

    prices.push({
      date: dateStr,
      price: Number.parseFloat(currentPrice.toFixed(2)),
      open: Number.parseFloat(openPrice.toFixed(2)),
      high: Number.parseFloat(dailyHigh.toFixed(2)),
      low: Number.parseFloat(dailyLow.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    })
  }

  return prices
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

function getVolatility(ticker) {
  const volatilityMap = {
    TSLA: 0.03, 
    NVDA: 0.025,
    AMD: 0.025,
    NFLX: 0.02,
    AMZN: 0.015,
    META: 0.015,
    AAPL: 0.01,
    MSFT: 0.01,
    GOOGL: 0.01,
    INTC: 0.01,
  }

  return volatilityMap[ticker] || 0.015 
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
