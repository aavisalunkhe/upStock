"use client"

import { useEffect, useRef } from "react"

export default function StockChart({ stockData }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined" && stockData) {
      const canvas = chartRef.current
      const ctx = canvas.getContext("2d")

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const padding = 40

      const prices = stockData.map((d) => d.price)
      const minPrice = Math.min(...prices) * 0.95
      const maxPrice = Math.max(...prices) * 1.05
      const priceRange = maxPrice - minPrice

      ctx.beginPath()
      ctx.strokeStyle = "#CBD5E1"
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.stroke()

      ctx.font = "12px Arial"
      ctx.fillStyle = "#64748B"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"

      for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (1 - i / 5)
        const price = minPrice + (priceRange * i) / 5
        ctx.fillText(price.toFixed(2), padding - 10, y)

        ctx.beginPath()
        ctx.strokeStyle = "#EFF6FF"
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      const step = Math.ceil(stockData.length / 5)
      for (let i = 0; i < stockData.length; i += step) {
        const x = padding + (width - 2 * padding) * (i / (stockData.length - 1))
        ctx.fillText(stockData[i].date, x, height - padding + 10)
      }

      // Draw price line
      ctx.beginPath()
      ctx.strokeStyle = "#0284C7"
      ctx.lineWidth = 2

      for (let i = 0; i < stockData.length; i++) {
        const x = padding + (width - 2 * padding) * (i / (stockData.length - 1))
        const y = padding + (height - 2 * padding) * (1 - (stockData[i].price - minPrice) / priceRange)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      for (let i = 0; i < stockData.length; i++) {
        const x = padding + (width - 2 * padding) * (i / (stockData.length - 1))
        const y = padding + (height - 2 * padding) * (1 - (stockData[i].price - minPrice) / priceRange)

        const sentiment = stockData[i].sentiment

        if (sentiment > 0.3) {
          ctx.fillStyle = "#22C55E"
        } else if (sentiment < -0.3) {
          ctx.fillStyle = "#EF4444"
        } else {
          ctx.fillStyle = "#94A3B8"
        }

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [stockData])

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef} width={800} height={400} className="w-full h-full"></canvas>
    </div>
  )
}
