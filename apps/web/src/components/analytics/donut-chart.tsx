'use client'

interface DonutChartProps {
  data: Array<{ label: string; value: number; percentage: number; color?: string }>
  size?: number
  strokeWidth?: number
}

const CHART_COLORS = [
  'oklch(0.82 0.11 346)', // Light pink
  'oklch(0.73 0.18 350)', // Medium pink
  'oklch(0.66 0.21 354)', // Pink
  'oklch(0.59 0.22 1)', // Deep pink
  'oklch(0.52 0.20 4)', // Dark pink
]

export function DonutChart({ data, size = 160, strokeWidth = 30 }: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  const radius = (size - strokeWidth) / 2
  const centerX = size / 2
  const centerY = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercentage = 0

  return (
    <div className="flex items-center gap-8">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = item.percentage
          const dashArray = (percentage / 100) * circumference
          const dashOffset = -(cumulativePercentage / 100) * circumference

          cumulativePercentage += percentage

          return (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={item.color || CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-300"
            />
          )
        })}
        {/* Center circle for donut effect */}
        <circle cx={centerX} cy={centerY} r={radius - strokeWidth / 2} fill="var(--card)" />
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-sm text-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
