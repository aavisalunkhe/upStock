import StockPredictionDashboard from "@/components/stock-prediction-dashboard"
import { SearchForm } from "@/components/search-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sky-900 mb-2">Stock Market Prediction</h1>
          <p className="text-lg text-sky-700">Using Tweet Sentiment Analysis to Predict Stock Movements</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <SearchForm />
          <StockPredictionDashboard />
        </div>
      </div>
    </div>
  )
}
