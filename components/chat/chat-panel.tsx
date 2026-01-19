"use client"

import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "@/components/chat/message-bubble"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { Spinner } from "@/components/loaders/spinner"
import { AnimatePresence } from "framer-motion"
import { getSocket } from "@/lib/socket"

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn: boolean
  isDelivered?: boolean
  isRead?: boolean
  isEncrypted?: boolean
  isVerified?: boolean
}

interface ChatPanelProps {
  userId: string
}

export function ChatPanel({ userId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const socket = getSocket()
  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}

  useEffect(() => {
    if (!currentUser.userId || !userId) return

    setIsLoading(true)
    socket.emit("get-conversation", { user1: currentUser.userId, user2: userId })

    socket.on("conversation-history", (data) => {
      console.log("[v0] Received conversation history:", data)

      // Transform backend messages to frontend format
      const transformedMessages = data.map((msg: any) => ({
        id: msg.id,
        content: msg.encrypted, // In real app, this would be decrypted
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: msg.from === currentUser.userId,
        isDelivered: msg.delivered,
        isRead: msg.read,
        isEncrypted: true,
        isVerified: msg.onBlockchain,
      }))

      setMessages(transformedMessages)
      setIsLoading(false)
    })

    socket.on("new-message", (message) => {
      console.log("[v0] New message received:", message)

      // Only add message if it's part of this conversation
      if (
        (message.from === userId && message.to === currentUser.userId) ||
        (message.from === currentUser.userId && message.to === userId)
      ) {
        const newMsg = {
          id: message.id,
          content: message.encrypted,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: message.from === currentUser.userId,
          isDelivered: message.delivered,
          isRead: message.read,
          isEncrypted: true,
          isVerified: message.onBlockchain,
        }
        setMessages((prev) => [...prev, newMsg])
      }
    })

    return () => {
      socket.off("conversation-history")
      socket.off("new-message")
    }
  }, [userId, currentUser.userId, socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start a conversation</p>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} {...message} />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
