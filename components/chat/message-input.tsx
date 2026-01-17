"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Smile, Timer } from "lucide-react"
import { SelfDestructSelector } from "@/components/chat/self-destruct-selector"

interface MessageInputProps {
  userId: string
  onSendMessage?: (message: string, selfDestructTime: number | null) => void
}

export function MessageInput({ userId, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [selfDestructTime, setSelfDestructTime] = useState<number | null>(null)

  const handleSend = () => {
    if (message.trim() && userId) {
      if (onSendMessage) {
        onSendMessage(message, selfDestructTime)
      }
      setMessage("")
      setSelfDestructTime(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTimerToggle = () => {
    setSelfDestructTime(selfDestructTime === null ? 10 : null)
  }

  if (!userId) {
    return (
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-center justify-center h-12 text-muted-foreground text-sm">
          Select a conversation to start messaging
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border p-4 bg-card">
      <SelfDestructSelector selectedTime={selfDestructTime} onSelect={setSelfDestructTime} />

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-12 max-h-32 resize-none bg-background pr-24"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          variant={selfDestructTime !== null ? "default" : "outline"}
          size="icon"
          className="transition-smooth h-12 w-12"
          onClick={handleTimerToggle}
        >
          <Timer className="h-5 w-5" />
        </Button>
        <Button onClick={handleSend} disabled={!message.trim()} className="transition-smooth h-12">
          <Send className="h-5 w-5 mr-2" />
          Send
        </Button>
      </div>
      <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
        <div className="h-1.5 w-1.5 rounded-full bg-success" />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  )
}
