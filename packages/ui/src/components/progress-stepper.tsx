"use client"

import * as React from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "../lib/utils"

export interface Step {
  label: string
  description?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function ProgressStepper({ steps, currentStep, className }: ProgressStepperProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={index} className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary bg-background animate-pulse",
                isUpcoming && "border-muted bg-muted text-muted-foreground"
              )}
            >
              {isCompleted && <Check className="h-5 w-5" />}
              {isCurrent && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              {isUpcoming && <span className="text-sm font-medium">{index + 1}</span>}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-foreground",
                  isCurrent && "text-primary font-semibold",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
