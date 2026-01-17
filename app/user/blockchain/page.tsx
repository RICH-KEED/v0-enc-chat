"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Wallet, Copy } from "lucide-react"
import { BlockchainPanel } from "@/components/user/blockchain-panel"

export default function UserBlockchainPage() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/user/settings">
            <Button variant="ghost" size="icon" className="transition-smooth">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Blockchain Activity</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Wallet Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-sm font-medium mb-1">Connected Wallet</p>
                <p className="text-xs text-muted-foreground font-mono">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <BlockchainPanel />
      </div>
    </div>
  )
}
