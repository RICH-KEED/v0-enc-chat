import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Shield, Blocks } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-balance">Cipher</h1>
          <p className="text-xl text-muted-foreground text-balance">Encrypted messaging with blockchain verification</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 py-12">
          <div className="p-6 rounded-lg border border-border bg-card space-y-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Secure Messaging</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">End-to-end encrypted conversations</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card space-y-2">
            <Shield className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Self-Destruct</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Messages that disappear automatically</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card space-y-2">
            <Blocks className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Blockchain Verified</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Cryptographically proven message integrity</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/user">
            <Button size="lg" className="transition-smooth">
              Open Chat
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="outline" className="transition-smooth bg-transparent">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
