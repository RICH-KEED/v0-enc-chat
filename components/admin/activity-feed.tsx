"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, MessageSquare, Shield, LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

interface Activity {
  type: string
  message: string
  time: string
  icon: any
}

export function ActivityFeed() {
  const socket = getSocket()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Fetch recent activities on load
    socket.emit("get-recent-activities")

    socket.on("recent-activities", (data: any[]) => {
      const formattedActivities = data.map((item: any) => {
        let icon = MessageSquare
        let message = ""
        
        if (item.type === "user") {
          icon = UserPlus
          message = `User ${item.username} registered`
        } else if (item.type === "message") {
          icon = MessageSquare
          message = `Message sent`
        } else if (item.type === "login") {
          icon = LogIn
          message = `User ${item.username} logged in`
        }

        return {
          type: item.type,
          message,
          time: getTimeAgo(new Date(item.timestamp)),
          icon,
        }
      })
      setActivities(formattedActivities)
    })

    // Listen for new user registrations
    socket.on("user-registered", (data: any) => {
      addActivity({
        type: "user",
        message: `New user registered: ${data.username}`,
        time: "Just now",
        icon: UserPlus,
      })
    })

    // Listen for new messages (removed - too spammy)

    // Listen for user login
    socket.on("user-logged-in", (data: any) => {
      addActivity({
        type: "status",
        message: `User ${data.username} logged in`,
        time: "Just now",
        icon: LogIn,
      })
    })

    // Listen for user online status
    socket.on("user-online", (data: any) => {
      addActivity({
        type: "status",
        message: `User came online`,
        time: "Just now",
        icon: LogIn,
      })
    })

    // Listen for user offline status
    socket.on("user-offline", (data: any) => {
      addActivity({
        type: "status",
        message: `User went offline`,
        time: "Just now",
        icon: LogOut,
      })
    })

    // Listen for blockchain transactions
    socket.on("message-sent", (data: any) => {
      if (data.success && data.onBlockchain) {
        addActivity({
          type: "blockchain",
          message: `Message verified on blockchain`,
          time: "Just now",
          icon: Shield,
        })
      }
    })

    return () => {
      socket.off("recent-activities")
      socket.off("user-registered")
      socket.off("user-logged-in")
      socket.off("user-online")
      socket.off("user-offline")
      socket.off("message-sent")
    }
  }, [socket])

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev].slice(0, 20)) // Keep last 20 activities
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Real-Time Activity</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity. Waiting for events...
            </p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                <div className="p-2 rounded-lg bg-muted/50">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
