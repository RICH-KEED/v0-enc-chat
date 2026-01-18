"use client"

import { cn } from "@/lib/utils"
import { Check, CheckCheck, Lock } from "lucide-react"
import { motion } from "framer-motion"

interface MessageBubbleProps {
  content: string
  timestamp: string
  isOwn: boolean
  isDelivered?: boolean
  isRead?: boolean
  isEncrypted?: boolean
  isVerified?: boolean
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  isDelivered = true,
  isRead = false,
  isEncrypted = true,
  isVerified = false,
}: MessageBubbleProps) {
  // Decode base64 encrypted message
  const decodeMessage = (encodedContent: string) => {
    try {
      return atob(encodedContent)
    } catch (error) {
      return encodedContent // Return original if decoding fails
    }
  }

  const displayContent = isEncrypted ? decodeMessage(content) : content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className={cn("flex gap-2 mb-3 group", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-md px-4 py-2 rounded-lg transition-smooth",
          isOwn ? "bg-primary text-primary-foreground" : "bg-card border border-border text-card-foreground",
        )}
      >
        <p className="text-sm leading-relaxed break-words">{displayContent}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs opacity-70">{timestamp}</span>
          {isEncrypted && <Lock className="h-3 w-3 opacity-70" />}
          {isVerified && <div className="h-1.5 w-1.5 rounded-full bg-success" title="Blockchain verified" />}
          {isOwn && (
            <span className="ml-auto">
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-success" />
              ) : isDelivered ? (
                <CheckCheck className="h-3 w-3 opacity-50" />
              ) : (
                <Check className="h-3 w-3 opacity-50" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
