"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, Phone, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

interface ChatHeaderProps {
  userId: string
}

interface UserData {
  userId: string
  username: string
  status: string
  isOnline: boolean
}

export function ChatHeader({ userId }: ChatHeaderProps) {
  const socket = getSocket()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    if (!userId) {
      setUser(null)
      return
    }

    // Fetch all users and find the selected one
    socket.emit("get-all-users")

    socket.on("all-users", (users: any[]) => {
      const selectedUser = users.find((u) => u.userId === userId)
      if (selectedUser) {
        setUser({
          userId: selectedUser.userId,
          username: selectedUser.username,
          status: selectedUser.status || "offline",
          isOnline: selectedUser.isOnline || false,
        })
      }
    })

    socket.on("user-online", (data: any) => {
      if (data.userId === userId) {
        setUser((prev) => prev ? { ...prev, status: data.status, isOnline: true } : null)
      }
    })

    socket.on("user-offline", (data: any) => {
      if (data.userId === userId) {
        setUser((prev) => prev ? { ...prev, status: "offline", isOnline: false } : null)
      }
    })

    return () => {
      socket.off("all-users")
      socket.off("user-online")
      socket.off("user-offline")
    }
  }, [userId, socket])

  if (!userId) {
    return (
      <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">?</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Select a conversation</h3>
            <p className="text-sm text-muted-foreground">Choose a user to start chatting</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.username?.substring(0, 2).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user?.username || "Loading..."}</h3>
          <p className="text-sm text-muted-foreground">
            {user?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="transition-smooth">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="transition-smooth">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="transition-smooth">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
