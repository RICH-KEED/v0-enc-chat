"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Bell, Shield, Wallet, Save, Upload, Camera } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: "John Doe",
    status: "Available for chat",
    userStatus: "online" as "online" | "offline" | "idle" | "dnd",
  })

  const [notifications, setNotifications] = useState({
    messageNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,
  })

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    readReceipts: true,
    typingIndicator: true,
  })

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log("[v0] Photo uploaded:", file.name)
        alert("Photo uploaded successfully!")
      }
    }
    input.click()
  }

  const handleSave = () => {
    console.log("[v0] Saving profile:", profile)
    alert("Settings saved successfully!")
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
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" className="transition-smooth bg-transparent" onClick={handlePhotoUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Message</Label>
                <Input
                  id="status"
                  value={profile.status}
                  onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                  className="bg-background"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userStatus">Availability Status</Label>
                <Select
                  value={profile.userStatus}
                  onValueChange={(value) =>
                    setProfile({ ...profile, userStatus: value as "online" | "offline" | "idle" | "dnd" })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success" />
                        <span>Online</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="idle">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Idle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dnd">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-error" />
                        <span>Do Not Disturb</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted" />
                        <span>Offline</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="transition-smooth" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
              </div>
              <Switch
                checked={notifications.messageNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, messageNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound</p>
                <p className="text-sm text-muted-foreground">Play sound for notifications</p>
              </div>
              <Switch
                checked={notifications.soundEnabled}
                onCheckedChange={(checked) => setNotifications({ ...notifications, soundEnabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Desktop Notifications</p>
                <p className="text-sm text-muted-foreground">Show desktop notifications when app is minimized</p>
              </div>
              <Switch
                checked={notifications.desktopNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, desktopNotifications: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Security Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Online Status</p>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch
                checked={privacy.showOnlineStatus}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Read Receipts</p>
                <p className="text-sm text-muted-foreground">Show when you've read messages</p>
              </div>
              <Switch
                checked={privacy.readReceipts}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, readReceipts: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Typing Indicator</p>
                <p className="text-sm text-muted-foreground">Show when you're typing</p>
              </div>
              <Switch
                checked={privacy.typingIndicator}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, typingIndicator: checked })}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm font-medium text-success">Encryption Active</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All messages are end-to-end encrypted. Your conversations are private and secure.
              </p>
            </div>
          </div>
        </Card>

        {/* Blockchain Wallet Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Blockchain Wallet</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium mb-1">Wallet Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm text-muted-foreground">Connected via MetaMask</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium mb-1">Verified Messages</p>
              <p className="text-2xl font-bold text-primary">1,247</p>
              <p className="text-xs text-muted-foreground mt-1">Messages verified on blockchain</p>
            </div>

            <Button
              variant="outline"
              className="w-full transition-smooth bg-transparent"
              onClick={() => router.push("/user/blockchain")}
            >
              View Blockchain Activity
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
