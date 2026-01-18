"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatHeader } from "@/components/chat/chat-header"
import { MessageInput } from "@/components/chat/message-input"
import { getSocket } from "@/lib/socket"

export default function UserPage() {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const socket = getSocket()

  useEffect(() => {
    const user = localStorage.getItem("cipher-user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const handleSendMessage = (message: string, selfDestructTime: number | null) => {
    const currentUser = JSON.parse(localStorage.getItem("cipher-user") || "{}")

    if (!currentUser.userId || !selectedUserId) {
      console.error("[Cipher] Cannot send message: missing user data")
      return
    }

    // In a real app, this would be encrypted client-side
    const encryptedMessage = btoa(message) // Simple base64 encoding as placeholder

    socket.emit("send-message", {
      from: currentUser.userId,
      to: selectedUserId,
      encrypted: encryptedMessage,
      selfDestruct: selfDestructTime || 0,
    })

    console.log("[Cipher] Message sent:", { message, to: selectedUserId, selfDestructTime })
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader userId={selectedUserId} />
        <ChatPanel userId={selectedUserId} />
        <MessageInput userId={selectedUserId} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
