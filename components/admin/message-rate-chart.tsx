"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { hour: "6AM", messages: 423 },
  { hour: "9AM", messages: 1245 },
  { hour: "12PM", messages: 2134 },
  { hour: "3PM", messages: 1876 },
  { hour: "6PM", messages: 2456 },
  { hour: "9PM", messages: 1532 },
]

export function MessageRateChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Message Rate</h3>
        <p className="text-sm text-muted-foreground">Messages sent per hour</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar dataKey="messages" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
