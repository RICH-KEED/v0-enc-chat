"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

export function MessageRateChart() {
  const socket = getSocket()
  const [data, setData] = useState<any[]>([])
  const [totalMessages, setTotalMessages] = useState(0)

  useEffect(() => {
    socket.emit("get-daily-message-stats")

    socket.on("daily-message-stats", (stats: any) => {
      setData(stats.daily || [])
      setTotalMessages(stats.total || 0)
    })

    const interval = setInterval(() => {
      socket.emit("get-daily-message-stats")
    }, 30000) // Refresh every 30 seconds

    return () => {
      socket.off("daily-message-stats")
      clearInterval(interval)
    }
  }, [socket])

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Message Statistics</h3>
        <p className="text-sm text-muted-foreground">Total messages: {totalMessages}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#10b981" 
            fontSize={12}
            tick={{ fill: "#10b981" }}
            style={{ fill: "#10b981" }}
          />
          <YAxis 
            stroke="#10b981" 
            fontSize={12}
            tick={{ fill: "#10b981" }}
            style={{ fill: "#10b981" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            itemStyle={{ color: "#10b981" }}
          />
          <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
          <Bar dataKey="messages" fill="#6366f1" radius={[8, 8, 0, 0]} name="Messages" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
