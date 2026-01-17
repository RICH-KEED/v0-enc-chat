"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelfDestructSelectorProps {
  selectedTime: number | null
  onSelect: (seconds: number | null) => void
}

const timeOptions = [
  { label: "10 sec", value: 10 },
  { label: "30 sec", value: 30 },
  { label: "1 min", value: 60 },
  { label: "5 min", value: 300 },
]

export function SelfDestructSelector({ selectedTime, onSelect }: SelfDestructSelectorProps) {
  if (selectedTime === null) return null

  return (
    <Card className="p-3 mb-2 bg-card/50 border-warning/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-warning">Self-destruct active</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onSelect(null)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex gap-2">
        {timeOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedTime === option.value ? "default" : "outline"}
            size="sm"
            className={cn(
              "text-xs transition-smooth",
              selectedTime === option.value && "bg-warning text-warning-foreground",
            )}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
