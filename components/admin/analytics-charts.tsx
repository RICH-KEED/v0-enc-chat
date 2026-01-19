"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const hourlyData = [
  { time: "00:00", messages: 234, users: 120, bandwidth: 45 },
  { time: "04:00", messages: 156, users: 85, bandwidth: 32 },
  { time: "08:00", messages: 845, users: 245, bandwidth: 78 },
  { time: "12:00", messages: 1234, users: 342, bandwidth: 92 },
  { time: "16:00", messages: 987, users: 298, bandwidth: 85 },
  { time: "20:00", messages: 756, users: 267, bandwidth: 71 },
]

const dailyData = [
  { day: "Mon", messages: 8234, users: 1245, errors: 12 },
  { day: "Tue", messages: 9156, users: 1432, errors: 8 },
  { day: "Wed", messages: 8942, users: 1389, errors: 15 },
  { day: "Thu", messages: 9567, users: 1521, errors: 6 },
  { day: "Fri", messages: 10234, users: 1678, errors: 11 },
  { day: "Sat", messages: 7845, users: 1234, errors: 9 },
  { day: "Sun", messages: 6789, users: 1098, errors: 7 },
]

export function AnalyticsCharts() {
  return (
    <Card className="p-6">
      <Tabs defaultValue="hourly" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Usage Analytics</h3>
          <TabsList className="bg-muted">
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hourly" className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Activity Overview (Last 24 Hours)</h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={hourlyData}>
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
                <Legend />
                <Line type="monotone" dataKey="messages" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Messages" />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Weekly Summary</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="messages" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Messages" />
                <Bar dataKey="users" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
