"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Wifi, Server } from "lucide-react"
import { cn } from "@/lib/utils"

const healthMetrics = [
  { label: "API Server", status: "healthy", icon: Server, uptime: "99.9%" },
  { label: "Database", status: "healthy", icon: Database, uptime: "99.8%" },
  { label: "WebSocket", status: "healthy", icon: Wifi, uptime: "99.7%" },
  { label: "Blockchain Node", status: "warning", icon: Activity, uptime: "98.2%" },
]

export function SystemHealth() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">System Health</h3>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          All Systems Operational
        </Badge>
      </div>

      <div className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", metric.status === "healthy" ? "bg-success/10" : "bg-warning/10")}>
                <metric.icon className={cn("h-4 w-4", metric.status === "healthy" ? "text-success" : "text-warning")} />
              </div>
              <div>
                <p className="font-medium text-sm">{metric.label}</p>
                <p className="text-xs text-muted-foreground">Uptime: {metric.uptime}</p>
              </div>
            </div>
            <div className={cn("h-2 w-2 rounded-full", metric.status === "healthy" ? "bg-success" : "bg-warning")} />
          </div>
        ))}
      </div>
    </Card>
  )
}
