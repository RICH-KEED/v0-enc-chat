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
    if (!currentUser.userId || !userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    socket.emit("get-conversation", { user1: currentUser.userId, user2: userId })

    // Mark messages as read when opening conversation
    socket.emit("mark-as-read", { from: userId, to: currentUser.userId })

    socket.on("conversation-history", (data) => {
      console.log("[Cipher] Received conversation history:", data)

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
      console.log("[Cipher] New message received:", message)

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

    // Listen for message read status updates
    socket.on("messages-read", (data) => {
      console.log("[Cipher] Messages read:", data)
      // Update all messages from the sender to mark as read
      if (data.from === userId && data.to === currentUser.userId) {
        setMessages((prev) =>
          prev.map((msg) =>
            !msg.isOwn ? { ...msg, isRead: true } : msg
          )
        )
      }
    })

    // Listen for message delivered status
    socket.on("message-delivered", (data) => {
      console.log("[Cipher] Message delivered:", data)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, isDelivered: true } : msg
        )
      )
    })

    return () => {
      socket.off("conversation-history")
      socket.off("new-message")
      socket.off("messages-read")
      socket.off("message-delivered")
    }
  }, [userId, currentUser.userId, socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Show empty state when no user is selected
  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-3 max-w-md px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Choose a user from the sidebar to start chatting or send encrypted messages
          </p>
        </div>
      </div>
    )
  }

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
