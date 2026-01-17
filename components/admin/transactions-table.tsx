"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Copy, Check } from "lucide-react"

interface Transaction {
  hash: string
  block: number
  timestamp: string
  type: string
  status: "verified" | "pending"
  size: string
}

const mockTransactions: Transaction[] = [
  {
    hash: "0x7a8f3b2c1d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    block: 45231,
    timestamp: "2 min ago",
    type: "Message",
    status: "verified",
    size: "2.4 KB",
  },
  {
    hash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    block: 45230,
    timestamp: "5 min ago",
    type: "Message",
    status: "verified",
    size: "1.8 KB",
  },
  {
    hash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    block: 45229,
    timestamp: "8 min ago",
    type: "User Action",
    status: "verified",
    size: "1.2 KB",
  },
  {
    hash: "0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
    block: 45228,
    timestamp: "12 min ago",
    type: "Message",
    status: "verified",
    size: "3.1 KB",
  },
  {
    hash: "0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    block: 45227,
    timestamp: "15 min ago",
    type: "Message",
    status: "pending",
    size: "2.7 KB",
  },
]

export function TransactionsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.block.toString().includes(searchTerm) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by hash, block, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Transaction Hash</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Block</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Time</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Size</th>
              <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.hash} className="border-b border-border hover:bg-accent/50 transition-smooth">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-primary">{truncateHash(tx.hash)}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyHash(tx.hash)}
                      title="Copy hash"
                    >
                      {copiedHash === tx.hash ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <code className="text-sm font-mono text-muted-foreground">#{tx.block}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-sm">{tx.timestamp}</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="bg-muted">
                    {tx.type}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant="secondary"
                    className={
                      tx.status === "verified"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${tx.status === "verified" ? "bg-success" : "bg-warning"}`}
                    />
                    {tx.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right text-sm text-muted-foreground">{tx.size}</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="View details">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      )}
    </Card>
  )
}
