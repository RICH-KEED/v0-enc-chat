"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Blocks, Shield, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const recentVerifications = [
  { id: "1", block: 45231, time: "2 min ago", verified: true },
  { id: "2", block: 45228, time: "8 min ago", verified: true },
  { id: "3", block: 45225, time: "15 min ago", verified: true },
  { id: "4", block: 45220, time: "22 min ago", verified: true },
]

export function BlockchainPanel() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Blockchain Verification</h3>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <Shield className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <p className="text-sm font-medium mb-2">Your Verified Messages</p>
          <p className="text-3xl font-bold text-primary">1,247</p>
          <p className="text-xs text-muted-foreground mt-1">All messages cryptographically proven</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Recent Verifications</p>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {recentVerifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium">Block #{item.block}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  )
}
