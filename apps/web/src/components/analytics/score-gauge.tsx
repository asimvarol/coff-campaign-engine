'use client'

interface ScoreGaugeProps {
  score: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
}

export function ScoreGauge({ score, size = 120, strokeWidth = 12, label }: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score, 0), 100)
  const dashOffset = circumference - (progress / 100) * circumference

  // Color based on score
  const getColor = (score: number) => {
    if (score >= 85) return 'oklch(0.82 0.11 346)' // Excellent - light pink
    if (score >= 70) return 'oklch(0.73 0.18 350)' // Good - medium pink
    if (score >= 50) return 'oklch(0.66 0.21 354)' // Average - pink
    if (score >= 30) return 'oklch(0.59 0.22 1)' // Poor - deep pink
    return 'oklch(0.52 0.20 4)' // Critical - dark pink
  }

  const color = getColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 10%)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2}
          fontSize={size / 4}
          fill="oklch(0.985 0.001 106.423)"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="transform rotate-90"
          style={{ transformOrigin: 'center' }}
        >
          {Math.round(score)}
        </text>
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}
