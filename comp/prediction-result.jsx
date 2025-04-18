import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"

export default function PredictionResult({ prediction, ticker }) {
  const { direction, confidence, date } = prediction
  const isUp = direction === "up"

  return (
    <Card className={`border-2 ${isUp ? "border-green-200" : "border-red-200"} shadow-md`}>
      <CardHeader className={`${isUp ? "bg-green-50" : "bg-red-50"} rounded-t-lg`}>
        <CardTitle className="text-sky-900 flex justify-between items-center">
          <span>Prediction for {ticker}</span>
          {isUp ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 flex items-center justify-center">
            {isUp ? (
              <>
                <ArrowUp className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-green-700">Bullish Prediction</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-red-700">Bearish Prediction</span>
              </>
            )}
          </div>

          <p className="text-lg mb-4">
            {isUp ? "The stock price is predicted to rise" : "The stock price is predicted to fall"}
          </p>

          <div className="bg-sky-50 rounded-lg p-4 inline-block">
            <div className="text-sm text-sky-700 mb-1">Confidence</div>
            <div className="text-3xl font-bold text-sky-900">{confidence}%</div>
          </div>

          <p className="text-sm text-gray-500 mt-4">Prediction for trading day: {date}</p>
        </div>
      </CardContent>
    </Card>
  )
}
