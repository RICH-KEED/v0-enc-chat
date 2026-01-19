"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Search, UserPlus, Check } from "lucide-react"
import { getSocket } from "@/lib/socket"

interface SearchResult {
  userId: string
  username: string
  email: string
  status: "online" | "offline" | "idle" | "dnd"
  isOnline: boolean
}

export default function AddFriendPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set())
  const socket = getSocket()

  useEffect(() => {
    socket.on("all-users", (users) => {
      console.log("[v0] Received all users:", users)
      setResults(users)
    })

    socket.on("friend-request-sent", (response) => {
      console.log("[v0] Friend request sent:", response)
    })

    return () => {
      socket.off("all-users")
      socket.off("friend-request-sent")
    }
  }, [socket])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("[v0] Searching for:", searchQuery)
      socket.emit("get-all-users")
    }
  }

  const handleAddFriend = (userId: string) => {
    const currentUser = JSON.parse(localStorage.getItem("cipher-user") || "{}")
    console.log("[v0] Sending friend request to:", userId)

    socket.emit("send-friend-request", {
      from: currentUser.userId,
      to: userId,
    })

    setAddedUsers(new Set(addedUsers).add(userId))
  }

  const filteredResults = results.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/user">
            <Button variant="ghost" size="icon" className="transition-smooth">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Add Friend</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6">
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-background"
              />
            </div>
            <Button onClick={handleSearch} className="transition-smooth">
              Search
            </Button>
          </div>

          {filteredResults.length > 0 && (
            <div className="space-y-3">
              {filteredResults.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                          user.isOnline ? "bg-success" : "bg-muted"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {addedUsers.has(user.userId) ? (
                    <Button variant="outline" disabled className="transition-smooth bg-transparent">
                      <Check className="h-4 w-4 mr-2" />
                      Request Sent
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddFriend(user.userId)} className="transition-smooth">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredResults.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
