"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", users: 120 },
  { time: "04:00", users: 85 },
  { time: "08:00", users: 245 },
  { time: "12:00", users: 342 },
  { time: "16:00", users: 298 },
  { time: "20:00", users: 267 },
  { time: "23:59", users: 189 },
]

export function ActiveUsersChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Active Users</h3>
        <p className="text-sm text-muted-foreground">Real-time user activity over 24 hours</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
