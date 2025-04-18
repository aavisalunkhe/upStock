"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TweetList from "@/components/tweet-list"
import StockChart from "@/components/stock-chart"
import SentimentSummary from "@/components/sentiment-summary"
import PredictionResult from "@/components/prediction-result"
import { analyzeStock } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function StockPredictionDashboard({ ticker = "TSLA" }) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (!ticker) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await analyzeStock(ticker)
        setData(result)
      } catch (err) {
        console.error("Error loading stock data:", err)
        setError(err.message || "Failed to analyze stock data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [ticker])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
        <p className="text-sky-700">Analyzing tweets and stock data for {ticker}...</p>
        <p className="text-sm text-gray-500">This may take a minute...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available. Please search for a stock ticker.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionResult prediction={data.prediction} ticker={ticker} />
        <SentimentSummary sentimentData={data.sentimentSummary} />
      </div>

      <Card className="border-sky-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-sky-900">Stock Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <StockChart stockData={data.stockData} />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sky-50">
          <TabsTrigger value="all">All Tweets ({data.tweets.length})</TabsTrigger>
          <TabsTrigger value="bullish">Bullish ({data.sentimentSummary.bullish})</TabsTrigger>
          <TabsTrigger value="bearish">Bearish ({data.sentimentSummary.bearish})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TweetList tweets={data.tweets} />
        </TabsContent>
        <TabsContent value="bullish">
          <TweetList tweets={data.tweets.filter((t) => t.sentiment === "bullish")} />
        </TabsContent>
        <TabsContent value="bearish">
          <TweetList tweets={data.tweets.filter((t) => t.sentiment === "bearish")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
