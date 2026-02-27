"use client"

import * as React from "react"
import { Input } from "./input"
import { cn } from "../lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="h-10 w-10 rounded-md border border-input cursor-pointer transition-all hover:scale-105"
        style={{ backgroundColor: value }}
        onClick={() => {
          const input = document.getElementById(`color-${value}`) as HTMLInputElement
          input?.click()
        }}
      />
      <Input
        type="color"
        id={`color-${value}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 uppercase"
        maxLength={7}
      />
    </div>
  )
}
