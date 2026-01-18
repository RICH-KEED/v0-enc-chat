"use client"

import { useState, useEffect } from "react"
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
import { getSocket } from "@/lib/socket"

export default function SettingsPage() {
  const router = useRouter()
  const socket = getSocket()
  
  // Get user data from localStorage
  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cipher-user") || "{}") : {}
  
  const [profile, setProfile] = useState({
    name: currentUser.username || "User",
    email: currentUser.email || "",
    status: "Available for chat",
    userStatus: (currentUser.status || "online") as "online" | "offline" | "idle" | "dnd",
    profilePicture: currentUser.profilePicture || "",
  })

  const [notifications, setNotifications] = useState({
    messageNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,
  })

  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    readReceipts: true,
    typingIndicator: true,
  })

  const handlePhotoUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setUploadingPhoto(true)
        
        // Convert image to base64 for preview
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          
          // Update profile picture in state
          setProfile({ ...profile, profilePicture: base64String })
          
          // Update localStorage
          const updatedUser = { ...currentUser, profilePicture: base64String }
          localStorage.setItem("cipher-user", JSON.stringify(updatedUser))
          
          setUploadingPhoto(false)
          
          // Show success message using a better UI
          const successDiv = document.createElement("div")
          successDiv.className = "fixed top-4 right-4 bg-success text-success-foreground px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top"
          successDiv.textContent = "✓ Profile photo updated!"
          document.body.appendChild(successDiv)
          setTimeout(() => successDiv.remove(), 3000)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  useEffect(() => {
    // Load user data on mount
    if (currentUser.username) {
      setProfile({
        name: currentUser.username,
        email: currentUser.email || "",
        status: "Available for chat",
        userStatus: (currentUser.status || "online") as "online" | "offline" | "idle" | "dnd",
        profilePicture: currentUser.profilePicture || "",
      })
    }
  }, [])

  const handleSave = () => {
    console.log("[Cipher] Saving profile:", profile)
    
    // Update status on backend
    socket.emit("update-status", {
      userId: currentUser.userId,
      status: profile.userStatus,
    })
    
    // Update localStorage
    const updatedUser = { ...currentUser, status: profile.userStatus }
    localStorage.setItem("cipher-user", JSON.stringify(updatedUser))
    
    // Show success toast
    const successDiv = document.createElement("div")
    successDiv.className = "fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top"
    successDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="font-medium">Settings saved successfully!</span>
    `
    document.body.appendChild(successDiv)
    setTimeout(() => {
      successDiv.style.opacity = "0"
      successDiv.style.transition = "opacity 300ms"
      setTimeout(() => successDiv.remove(), 300)
    }, 3000)
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
                  {profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  onClick={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button 
                variant="outline" 
                className="transition-smooth bg-transparent" 
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingPhoto ? "Uploading..." : "Change Photo"}
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
                  disabled
                />
                <p className="text-xs text-muted-foreground">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  className="bg-background"
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
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
                        <div className="h-2 w-2 rounded-full bg-red-500" />
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
                {currentUser.walletAddress ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </>
                )}
              </div>
              {currentUser.walletAddress && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {currentUser.walletAddress.substring(0, 6)}...{currentUser.walletAddress.substring(38)}
                </p>
              )}
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
