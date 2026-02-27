'use client'

import type { ReachTrendDataPoint } from '@repo/types'

interface LineChartProps {
  data: ReachTrendDataPoint[]
  dataKey: 'reach' | 'engagement' | 'clicks'
  color?: string
  height?: number
  showGrid?: boolean
}

export function LineChart({
  data,
  dataKey,
  color = 'oklch(0.66 0.21 354)',
  height = 200,
  showGrid = true,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  const width = 100 // Percentage
  const padding = { top: 10, right: 10, bottom: 30, left: 40 }
  const chartWidth = 100 - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const values = data.map((d) => d[dataKey])
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const valueRange = maxValue - minValue || 1

  // Generate path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth + padding.left
    const y = height - padding.bottom - ((d[dataKey] - minValue) / valueRange) * chartHeight
    return { x, y, value: d[dataKey] }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Area fill path
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`

  // Grid lines
  const gridLines = showGrid
    ? Array.from({ length: 5 }, (_, i) => {
        const y = padding.top + (chartHeight / 4) * i
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={100 - padding.right}
            y2={y}
            stroke="oklch(1 0 0 / 5%)"
            strokeWidth="1"
          />
        )
      })
    : null

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      style={{ maxHeight: `${height}px` }}
    >
      {/* Grid */}
      {gridLines}

      {/* Area fill */}
      <path d={areaD} fill={color} fillOpacity="0.1" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.8"
          fill={color}
          className="transition-all hover:r-1.5"
        />
      ))}

      {/* Y-axis labels */}
      <text
        x={padding.left - 3}
        y={padding.top}
        fontSize="2.5"
        fill="oklch(0.985 0.001 106.423 / 60%)"
        textAnchor="end"
        alignmentBaseline="middle"
      >
        {Math.round(maxValue)}
      </text>
      <text
        x={padding.left - 3}
        y={height - padding.bottom}
        fontSize="2.5"
        fill="oklch(0.985 0.001 106.423 / 60%)"
        textAnchor="end"
        alignmentBaseline="middle"
      >
        {Math.round(minValue)}
      </text>
    </svg>
  )
}
