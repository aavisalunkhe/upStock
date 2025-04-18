import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus, MessageSquare, Repeat, Heart, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TweetList({ tweets }) {
  if (!tweets || tweets.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tweets found for this filter.</div>
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "bullish":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "bearish":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "bearish":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const sortedTweets = [...tweets].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    if (dateB - dateA === 0) {
      return b.retweets - a.retweets
    }
    return dateB - dateA
  })

  return (
    <div className="space-y-4 mt-4">
      {sortedTweets.map((tweet) => (
        <Card key={tweet.id} className="border-sky-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                {tweet.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sky-900">{tweet.author}</p>
                    <p className="text-sm text-gray-500">{new Date(tweet.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentColor(tweet.sentiment)}>
                      <span className="flex items-center gap-1">
                        {getSentimentIcon(tweet.sentiment)}
                        {tweet.sentiment.charAt(0).toUpperCase() + tweet.sentiment.slice(1)}
                      </span>
                    </Badge>
                    {tweet.url && (
                      <a
                        href={tweet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:text-sky-700"
                        title="View on Twitter"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{tweet.text}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {tweet.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Repeat className="h-4 w-4" />
                    {tweet.retweets}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {tweet.likes}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
