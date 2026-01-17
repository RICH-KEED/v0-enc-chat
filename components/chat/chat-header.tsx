"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, Phone, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
  userId: string
}

const mockUserData: Record<string, { name: string; status: string }> = {
  "user-1": { name: "Alice Chen", status: "Online" },
  "user-2": { name: "Bob Smith", status: "Online" },
  "user-3": { name: "Carol Davis", status: "Last seen 1h ago" },
  "user-4": { name: "David Wilson", status: "Online" },
  "user-5": { name: "Eve Martinez", status: "Last seen yesterday" },
}

export function ChatHeader({ userId }: ChatHeaderProps) {
  const user = mockUserData[userId]

  return (
    <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.name
              .split(" ")
              .map((n) => n[0])
              .join("") || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user?.name || "Unknown User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.status || "Offline"}</p>
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
