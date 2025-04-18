import StockPredictionDashboard from "@/components/stock-prediction-dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DashboardPage({ params }) {
  const { ticker } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-sky-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">{ticker} Stock Analysis</h1>
          <p className="text-lg text-sky-700">Tweet Sentiment Analysis and Stock Prediction</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <StockPredictionDashboard ticker={ticker} />
        </div>
      </div>
    </div>
  )
}
