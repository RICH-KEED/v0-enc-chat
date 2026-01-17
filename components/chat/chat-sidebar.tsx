"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Search, Settings, ChevronLeft, ChevronRight, LogOut, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  status: "online" | "offline" | "idle" | "dnd"
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

const mockUsers: User[] = [
  { id: "user-1", name: "Alice Chen", status: "online", lastMessage: "See you tomorrow!", lastMessageTime: "2m" },
  {
    id: "user-2",
    name: "Bob Smith",
    status: "online",
    lastMessage: "Thanks for the update",
    lastMessageTime: "15m",
    unreadCount: 2,
  },
  { id: "user-3", name: "Carol Davis", status: "offline", lastMessage: "Got it, will check", lastMessageTime: "1h" },
  { id: "user-4", name: "David Wilson", status: "idle", lastMessage: "Perfect timing", lastMessageTime: "3h" },
  {
    id: "user-5",
    name: "Eve Martinez",
    status: "dnd",
    lastMessage: "Let me know when ready",
    lastMessageTime: "1d",
  },
]

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
      return "bg-error"
    case "offline":
      return "bg-muted"
  }
}

export function ChatSidebar({ selectedUserId, onSelectUser, isCollapsed, onToggleCollapse }: ChatSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

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
              <Input placeholder="Search conversations" className="pl-9 bg-background border-border" />
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
          {mockUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-smooth hover:bg-accent/50 border-l-2",
                selectedUserId === user.id ? "bg-primary/10 border-primary" : "border-transparent",
                isCollapsed && "justify-center",
              )}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
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
                    <span className="font-medium text-sm truncate">{user.name}</span>
                    {user.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                    )}
                  </div>
                  {user.lastMessage && <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>}
                </div>
              )}
              {!isCollapsed && user.unreadCount && user.unreadCount > 0 && (
                <div className="h-5 min-w-5 px-1.5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">{user.unreadCount}</span>
                </div>
              )}
            </button>
          ))}
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
