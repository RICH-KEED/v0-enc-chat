"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Wallet, Shield } from "lucide-react"
import { getSocket } from "@/lib/socket"

export default function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"email" | "blockchain">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const socket = getSocket()

  useEffect(() => {
    socket.on("login-success", (data) => {
      console.log("[Cipher] Login successful:", data)
      localStorage.setItem("cipher-token", data.token)
      localStorage.setItem("cipher-user", JSON.stringify(data))
      setIsLoading(false)
      router.push("/user")
    })

    socket.on("login-error", (error) => {
      console.error("[Cipher] Login error:", error)
      const errorMessage = error?.message || "Invalid email or password"
      setError(errorMessage)
      setPassword("") // Clear password field on error
      setIsLoading(false)
    })

    socket.on("error", (error) => {
      console.error("[Cipher] Socket error:", error)
      setError(error.message || "Login failed")
      setIsLoading(false)
    })

    return () => {
      socket.off("login-success")
      socket.off("login-error")
      socket.off("error")
    }
  }, [socket, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    socket.emit("login-user", { email, password })
  }

  const handleBlockchainLogin = () => {
    setIsLoading(true)
    setError("Blockchain login coming soon")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Cipher</h1>
          <p className="text-muted-foreground">Secure, encrypted messaging</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={loginMethod === "email" ? "default" : "outline"}
            className="flex-1 transition-smooth"
            onClick={() => setLoginMethod("email")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button
            variant={loginMethod === "blockchain" ? "default" : "outline"}
            className="flex-1 transition-smooth"
            onClick={() => setLoginMethod("blockchain")}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Blockchain
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full transition-smooth" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
              <Wallet className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="text-sm text-muted-foreground mb-4">Connect your blockchain wallet to login securely</p>
              <Button onClick={handleBlockchainLogin} className="w-full transition-smooth" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </div>
        )}

        <Separator className="my-6" />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button variant="link" className="p-0 h-auto font-medium" onClick={() => router.push("/register")}>
            Sign up
          </Button>
        </div>
      </Card>
    </div>
  )
}
