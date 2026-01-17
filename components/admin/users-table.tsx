"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  status: "online" | "offline"
  joinDate: string
  messages: number
}

const mockUsers: User[] = [
  { id: "1", name: "Alice Chen", email: "alice@***", status: "online", joinDate: "2024-01-15", messages: 1234 },
  { id: "2", name: "Bob Smith", email: "bob@***", status: "online", joinDate: "2024-02-20", messages: 856 },
  { id: "3", name: "Carol Davis", email: "carol@***", status: "offline", joinDate: "2024-03-10", messages: 432 },
  { id: "4", name: "David Wilson", email: "david@***", status: "online", joinDate: "2023-12-05", messages: 2145 },
  { id: "5", name: "Eve Martinez", email: "eve@***", status: "offline", joinDate: "2024-01-28", messages: 678 },
]

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Button variant="outline" className="transition-smooth bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">User</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Joined</th>
              <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Messages</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-accent/50 transition-smooth">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant="secondary"
                    className={cn(
                      user.status === "online"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full mr-1.5",
                        user.status === "online" ? "bg-success" : "bg-muted-foreground",
                      )}
                    />
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{user.joinDate}</td>
                <td className="py-3 px-4 text-right font-mono">{user.messages.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
