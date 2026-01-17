"use client"

import { AdminNav } from "@/components/admin/admin-nav"
import { BlockchainStats } from "@/components/admin/blockchain-stats"
import { TransactionsTable } from "@/components/admin/transactions-table"

export default function AdminBlockchainPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
          <p className="text-muted-foreground mt-1">View all blockchain transactions and encrypted message records</p>
        </div>
        <BlockchainStats />
        <TransactionsTable />
      </div>
    </div>
  )
}
