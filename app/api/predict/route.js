import { NextResponse } from "next/server"
import { predictStockMovement } from "@/lib/stock-prediction"

export async function POST(request) {
  try {
    const { ticker, tweets, historicalPrices, lookbackWindow = 14 } = await request.json()

    if (!ticker || !tweets || !historicalPrices) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const prediction = await predictStockMovement(ticker, tweets, historicalPrices, lookbackWindow)

    return NextResponse.json({
      success: true,
      prediction,
    })
  } catch (error) {
    console.error("Error making prediction:", error)
    return NextResponse.json({ error: "Failed to make prediction" }, { status: 500 })
  }
}
