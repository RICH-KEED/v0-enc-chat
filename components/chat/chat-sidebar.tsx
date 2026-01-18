"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Search, Settings, ChevronLeft, ChevronRight, LogOut, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"

interface User {
  userId: string
  username: string
  status: "online" | "offline" | "idle" | "dnd"
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
  profilePicture?: string
}

interface ChatSidebarProps {
  selectedUserId: string
  onSelectUser: (userId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const getStatusColor = (status: User["status"]) => {
  switch (status) {
    case "online":
      return "bg-success"
    case "idle":
      return "bg-amber-500"
    case "dnd":
      return "bg-red-500"
    case "offline":
      return "bg-muted"
  }
}

export function ChatSidebar({ selectedUserId, onSelectUser, isCollapsed, onToggleCollapse }: ChatSidebarProps) {
  const router = useRouter()
  const socket = getSocket()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Fetch all users
    socket.emit("get-all-users")

    socket.on("all-users", (fetchedUsers: any[]) => {
      const mappedUsers = fetchedUsers.map((user) => ({
        userId: user.userId,
        username: user.username,
        status: user.status || "offline",
        isOnline: user.isOnline,
        profilePicture: user.profilePicture || "",
        unreadCount: 0,
      }))
      setUsers(mappedUsers)
      
      // Fetch unread counts for each user
      const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}
      if (currentUser.userId) {
        fetchedUsers.forEach((user) => {
          socket.emit("get-unread-from-user", { from: user.userId, to: currentUser.userId })
        })
      }
    })

    socket.on("unread-from-user", (data: any) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === data.from ? { ...user, unreadCount: data.count } : user
        )
      )
    })

    socket.on("user-online", (data: any) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === data.userId ? { ...user, status: data.status, isOnline: true } : user
        )
      )
    })

    socket.on("user-offline", (data: any) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === data.userId ? { ...user, status: "offline", isOnline: false } : user
        )
      )
    })

    socket.on("new-message", (message: any) => {
      const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}
      if (message.to === currentUser.userId) {
        setUsers((prev) =>
          prev.map((user) =>
            user.userId === message.from ? { ...user, unreadCount: (user.unreadCount || 0) + 1 } : user
          )
        )
      }
    })

    socket.on("messages-read", (data: any) => {
      const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}
      if (data.to === currentUser.userId) {
        setUsers((prev) =>
          prev.map((user) =>
            user.userId === data.from ? { ...user, unreadCount: 0 } : user
          )
        )
      }
    })

    return () => {
      socket.off("all-users")
      socket.off("unread-from-user")
      socket.off("user-online")
      socket.off("user-offline")
      socket.off("new-message")
      socket.off("messages-read")
    }
  }, [socket])

  const handleLogout = () => {
    localStorage.removeItem("cipher-token")
    localStorage.removeItem("cipher-user")
    router.push("/login")
  }

  // Get current user from localStorage
  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}

  // Filter out current user and apply search
  const filteredUsers = users.filter((user) =>
    user.userId !== currentUser.userId && // Don't show current user in the list
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn("border-r border-border bg-card transition-all duration-300", isCollapsed ? "w-16" : "w-80")}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && <h2 className="font-semibold text-lg">Messages</h2>}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="transition-smooth">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search & Add Friend */}
        {!isCollapsed && (
          <div className="p-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations" 
                className="pl-9 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="w-full transition-smooth bg-transparent"
              onClick={() => router.push("/user/add-friend")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>
        )}

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {users.length === 0 ? "No users found" : "No matches found"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.userId}
                onClick={() => onSelectUser(user.userId)}
                className={cn(
                  "w-full p-4 flex items-center gap-3 transition-smooth hover:bg-accent/50 border-l-2",
                  selectedUserId === user.userId ? "bg-primary/10 border-primary" : "border-transparent",
                  isCollapsed && "justify-center",
                )}
              >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                    getStatusColor(user.status),
                  )}
                />
              </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">{user.username}</span>
                      {user.isOnline && (
                        <span className="text-xs text-success">Online</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.status}</p>
                  </div>
                )}
                {!isCollapsed && user.unreadCount > 0 && (
                  <div className="h-5 min-w-5 px-1.5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">{user.unreadCount}</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Settings & Logout */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border space-y-2">
            <Link href="/user/settings">
              <Button variant="ghost" className="w-full justify-start transition-smooth">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start transition-smooth text-error"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
