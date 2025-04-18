"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { fetchStockData } from "@/lib/actions"

export function SearchForm() {
  const [ticker, setTicker] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ticker) return

    setIsLoading(true)
    try {
      await fetchStockData(ticker)
      router.push(`/dashboard/${ticker}`)
    } catch (error) {
      console.error("Error fetching stock data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-8 border-sky-100 shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-sky-500" />
            </div>
            <Input
              type="text"
              placeholder="Enter stock ticker (e.g., TSLA)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="pl-10 border-sky-200 focus:border-sky-500"
              required
            />
          </div>
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
            {isLoading ? "Loading..." : "Analyze"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
