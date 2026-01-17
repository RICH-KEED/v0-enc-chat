"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, MessageSquare, Shield, AlertCircle } from "lucide-react"

const activities = [
  {
    type: "user",
    message: "New user registered",
    time: "2 min ago",
    icon: UserPlus,
    variant: "success" as const,
  },
  {
    type: "message",
    message: "1,234 messages sent",
    time: "5 min ago",
    icon: MessageSquare,
    variant: "default" as const,
  },
  {
    type: "blockchain",
    message: "Block verified #45231",
    time: "8 min ago",
    icon: Shield,
    variant: "success" as const,
  },
  {
    type: "alert",
    message: "High CPU usage detected",
    time: "12 min ago",
    icon: AlertCircle,
    variant: "warning" as const,
  },
  {
    type: "user",
    message: "User alice@example.com logged in",
    time: "15 min ago",
    icon: UserPlus,
    variant: "default" as const,
  },
  {
    type: "blockchain",
    message: "Smart contract executed",
    time: "18 min ago",
    icon: Shield,
    variant: "success" as const,
  },
]

export function ActivityFeed() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Real-Time Activity</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
              <div className="p-2 rounded-lg bg-muted/50">
                <activity.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
