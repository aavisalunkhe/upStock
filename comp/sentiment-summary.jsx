import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export default function SentimentSummary({ sentimentData }) {
  const { bullish, bearish, neutral } = sentimentData
  const total = bullish + bearish + neutral

  const bullishPercent = Math.round((bullish / total) * 100)
  const bearishPercent = Math.round((bearish / total) * 100)
  const neutralPercent = Math.round((neutral / total) * 100)

  return (
    <Card className="border-sky-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-sky-900">Tweet Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="font-medium">Bullish</span>
              </div>
              <span className="text-green-600 font-semibold">{bullishPercent}%</span>
            </div>
            <Progress value={bullishPercent} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="font-medium">Bearish</span>
              </div>
              <span className="text-red-600 font-semibold">{bearishPercent}%</span>
            </div>
            <Progress value={bearishPercent} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Minus className="h-4 w-4 text-gray-500 mr-1" />
                <span className="font-medium">Neutral</span>
              </div>
              <span className="text-gray-600 font-semibold">{neutralPercent}%</span>
            </div>
            <Progress value={neutralPercent} className="h-2 bg-gray-100" indicatorClassName="bg-gray-400" />
          </div>

          <div className="pt-2 text-sm text-gray-500 text-center">Based on {total} tweets over the past 14 days</div>
        </div>
      </CardContent>
    </Card>
  )
}
