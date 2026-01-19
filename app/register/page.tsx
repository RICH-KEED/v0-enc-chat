"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield } from "lucide-react"
import { getSocket } from "@/lib/socket"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const socket = getSocket()

  useEffect(() => {
    socket.on("user-registered", (data) => {
      console.log("[v0] Registration successful:", data)
      socket.emit("login-user", { email, password })
    })

    socket.on("login-success", (data) => {
      console.log("[v0] Login after registration successful:", data)
      localStorage.setItem("cipher-token", data.token)
      localStorage.setItem("cipher-user", JSON.stringify(data))
      setIsLoading(false)
      router.push("/user")
    })

    socket.on("registration-error", (error) => {
      console.error("[v0] Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
      setIsLoading(false)
    })

    socket.on("login-error", (error) => {
      console.error("[v0] Login error after registration:", error)
      setError("Account created but login failed. Please try logging in manually.")
      setIsLoading(false)
    })

    socket.on("error", (error) => {
      console.error("[v0] Socket error:", error)
      setError(error.message || "An error occurred. Please try again.")
      setIsLoading(false)
    })

    return () => {
      socket.off("user-registered")
      socket.off("login-success")
      socket.off("registration-error")
      socket.off("login-error")
      socket.off("error")
    }
  }, [socket, router, email, password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")

    console.log("[v0] Attempting registration:", { username, email })
    socket.emit("register-user", { username, email, password })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Cipher's secure network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-background"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full transition-smooth" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <Separator className="my-6" />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button variant="link" className="p-0 h-auto font-medium" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  )
}
