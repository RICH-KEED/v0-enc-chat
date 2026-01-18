"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

export function MessageRateChart() {
  const socket = getSocket()
  const [stats, setStats] = useState({ totalMessages: 0 })

  useEffect(() => {
    socket.emit("get-stats")

    socket.on("system-stats", (data: any) => {
      setStats({ totalMessages: data.totalMessages || 0 })
    })

    const interval = setInterval(() => {
      socket.emit("get-stats")
    }, 10000)

    return () => {
      socket.off("system-stats")
      clearInterval(interval)
    }
  }, [socket])

  const data = [
    { period: "Total", messages: stats.totalMessages },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Message Statistics</h3>
        <p className="text-sm text-muted-foreground">Total messages: {stats.totalMessages}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="period" 
            stroke="hsl(var(--foreground))" 
            fontSize={12}
            tick={{ fill: "white" }}
            style={{ fill: "white" }}
          />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            fontSize={12}
            tick={{ fill: "white" }}
            style={{ fill: "white" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
          <Bar dataKey="messages" fill="#6366f1" radius={[8, 8, 0, 0]} name="Total Messages" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
