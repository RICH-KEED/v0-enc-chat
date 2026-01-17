"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, Shield, Clock } from "lucide-react"

const mockUserProfiles: Record<
  string,
  { name: string; status: string; joinedDate: string; messagesExchanged: number }
> = {
  "user-1": { name: "Alice Chen", status: "Online", joinedDate: "Jan 2024", messagesExchanged: 234 },
  "user-2": { name: "Bob Smith", status: "Online", joinedDate: "Feb 2024", messagesExchanged: 156 },
  "user-3": { name: "Carol Davis", status: "Last seen 1h ago", joinedDate: "Mar 2024", messagesExchanged: 89 },
  "user-4": { name: "David Wilson", status: "Online", joinedDate: "Dec 2023", messagesExchanged: 412 },
  "user-5": { name: "Eve Martinez", status: "Last seen yesterday", joinedDate: "Jan 2024", messagesExchanged: 78 },
}

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const userProfile = mockUserProfiles[userId]

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/user">
            <Button variant="ghost" size="icon" className="transition-smooth">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-muted-foreground mt-1">{userProfile.status}</p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <Shield className="h-3 w-3 mr-1" />
              Verified User
            </Badge>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{userProfile.messagesExchanged}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Encrypted</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{userProfile.joinedDate}</p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 bg-muted/30 border-border">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Privacy Protected</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Additional user details are kept private. Wallet addresses and blockchain data are not exposed in user
                profiles.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/user" className="flex-1">
            <Button className="w-full transition-smooth">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
