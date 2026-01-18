"use client"

import { Card } from "@/components/ui/card"
import { Users, MessageSquare, Shield, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

export function StatsCards() {
  const socket = getSocket()
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalMessages: 0,
    blockchainMessages: 0,
  })

  useEffect(() => {
    socket.emit("get-stats")

    socket.on("system-stats", (data: any) => {
      setStats({
        totalUsers: data.totalUsers || 0,
        onlineUsers: data.onlineUsers || 0,
        totalMessages: data.totalMessages || 0,
        blockchainMessages: data.blockchainMessages || 0,
      })
    })

    // Refresh stats every 10 seconds
    const interval = setInterval(() => {
      socket.emit("get-stats")
    }, 10000)

    return () => {
      socket.off("system-stats")
      clearInterval(interval)
    }
  }, [socket])

  const statsData = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      label: "Total Messages",
      value: stats.totalMessages.toLocaleString(),
      icon: MessageSquare,
    },
    {
      label: "Blockchain Records",
      value: stats.blockchainMessages.toLocaleString(),
      icon: Shield,
    },
    {
      label: "Active Now",
      value: stats.onlineUsers.toLocaleString(),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
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
