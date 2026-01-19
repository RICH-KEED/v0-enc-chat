"use client"

import { Card } from "@/components/ui/card"
import { Blocks, FileText, Zap, CheckCircle } from "lucide-react"

const stats = [
  {
    label: "Total Blocks",
    value: "45,231",
    subtext: "Latest: #45231",
    icon: Blocks,
  },
  {
    label: "Verified Messages",
    value: "128,945",
    subtext: "In last 24h: 8,942",
    icon: FileText,
  },
  {
    label: "Avg. Block Time",
    value: "2.3s",
    subtext: "Network stable",
    icon: Zap,
  },
  {
    label: "Success Rate",
    value: "99.8%",
    subtext: "High reliability",
    icon: CheckCircle,
  },
]

export function BlockchainStats() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
