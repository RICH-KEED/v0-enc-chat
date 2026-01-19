"use client"

import { Card } from "@/components/ui/card"
import { Users, MessageSquare, Shield, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Total Users",
    value: "1,247",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Messages Today",
    value: "8,942",
    change: "+5.7%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "Blockchain Records",
    value: "45,231",
    change: "+18.2%",
    trend: "up",
    icon: Shield,
  },
  {
    label: "Active Now",
    value: "342",
    change: "+8.1%",
    trend: "up",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-success flex items-center gap-1">
                <span>{stat.change}</span>
                <span className="text-muted-foreground">vs last period</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
