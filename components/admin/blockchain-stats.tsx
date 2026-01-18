"use client"

import { Card } from "@/components/ui/card"
import { Blocks, FileText, Zap, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

export function BlockchainStats() {
  const socket = getSocket()
  const [stats, setStats] = useState({
    totalMessages: 0,
    blockchainMessages: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    socket.emit("get-stats")

    socket.on("system-stats", (data: any) => {
      setStats({
        totalMessages: data.totalMessages || 0,
        blockchainMessages: data.blockchainMessages || 0,
        totalUsers: data.totalUsers || 0,
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

  const successRate = stats.totalMessages > 0 
    ? ((stats.blockchainMessages / stats.totalMessages) * 100).toFixed(1)
    : "0.0"

  const statsData = [
    {
      label: "Total Messages",
      value: stats.totalMessages.toLocaleString(),
      subtext: `${stats.totalUsers} users`,
      icon: Blocks,
    },
    {
      label: "Verified Messages",
      value: stats.blockchainMessages.toLocaleString(),
      subtext: "Stored on blockchain",
      icon: FileText,
    },
    {
      label: "Network Status",
      value: stats.blockchainMessages > 0 ? "Active" : "Standby",
      subtext: stats.blockchainMessages > 0 ? "Blockchain connected" : "Waiting for transactions",
      icon: Zap,
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      subtext: `${stats.blockchainMessages} verified`,
      icon: CheckCircle,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
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
