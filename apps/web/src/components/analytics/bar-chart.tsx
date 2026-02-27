'use client'

interface BarChartProps {
  data: Array<{ label: string; value: number }>
  color?: string
  height?: number
  maxValue?: number
}

export function BarChart({
  data,
  color = 'oklch(0.66 0.21 354)',
  height = 200,
  maxValue,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  const max = maxValue || Math.max(...data.map((d) => d.value))
  const barWidth = 80 / data.length
  const gap = 5 / data.length

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      style={{ maxHeight: `${height}px` }}
    >
      {/* Grid lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={i}
          x1="10"
          y1={10 + (i * 70) / 4}
          x2="95"
          y2={10 + (i * 70) / 4}
          stroke="oklch(1 0 0 / 5%)"
          strokeWidth="0.2"
        />
      ))}

      {/* Bars */}
      {data.map((item, index) => {
        const barHeight = (item.value / max) * 70
        const x = 10 + index * (barWidth + gap)
        const y = 80 - barHeight

        return (
          <g key={index}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx="1" />
            <text
              x={x + barWidth / 2}
              y="92"
              fontSize="3"
              fill="oklch(0.985 0.001 106.423 / 60%)"
              textAnchor="middle"
            >
              {item.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 2}
              fontSize="3"
              fill="oklch(0.985 0.001 106.423)"
              textAnchor="middle"
            >
              {item.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
