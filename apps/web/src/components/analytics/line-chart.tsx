'use client'

import { useState, useRef, useCallback } from 'react'
import type { ReachTrendDataPoint } from '@repo/types'

interface LineChartProps {
  data: ReachTrendDataPoint[]
  dataKey: 'reach' | 'engagement' | 'clicks'
  color?: string
  height?: number
  showGrid?: boolean
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function LineChart({
  data,
  dataKey,
  color = 'hsl(var(--primary))',
  height = 240,
  showGrid = true,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  const svgWidth = 800
  const svgHeight = height
  const padding = { top: 20, right: 20, bottom: 40, left: 60 }
  const chartWidth = svgWidth - padding.left - padding.right
  const chartHeight = svgHeight - padding.top - padding.bottom

  const values = data.map((d) => d[dataKey])
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1
  // Add 10% headroom
  const displayMin = Math.max(0, minValue - range * 0.05)
  const displayMax = maxValue + range * 0.1
  const displayRange = displayMax - displayMin

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth
    const y = padding.top + (1 - (d[dataKey] - displayMin) / displayRange) * chartHeight
    return { x, y, value: d[dataKey], date: d.date }
  })

  // Smooth curve using cubic bezier (catmull-rom → bezier)
  const linePath = (() => {
    if (points.length < 2) return ''
    const tension = 0.3
    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]

      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  })()

  // Area path (same curve + close at bottom)
  const areaPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
    : ''

  // Y-axis grid lines & labels (5 steps)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = displayMin + (displayRange / 4) * i
    const y = padding.top + (1 - (value - displayMin) / displayRange) * chartHeight
    return { value, y }
  })

  // X-axis labels (show ~6 evenly spaced dates)
  const xLabelCount = Math.min(6, data.length)
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    const idx = Math.round((i / (xLabelCount - 1)) * (data.length - 1))
    const d = data[idx]
    const x = points[idx].x
    const dateStr = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return { x, label: dateStr }
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth
      // Find nearest point
      let closest = 0
      let minDist = Infinity
      for (let i = 0; i < points.length; i++) {
        const dist = Math.abs(points[i].x - mouseX)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      }
      setHoveredIndex(closest)
    },
    [points, svgWidth]
  )

  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {showGrid &&
        yTicks.map((tick, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={tick.y}
            x2={svgWidth - padding.right}
            y2={tick.y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

      {/* Y-axis labels */}
      {yTicks.map((tick, i) => (
        <text
          key={i}
          x={padding.left - 10}
          y={tick.y}
          fontSize="11"
          fill="hsl(var(--muted-foreground))"
          textAnchor="end"
          dominantBaseline="middle"
          className="font-mono"
        >
          {formatNumber(Math.round(tick.value))}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={svgHeight - 10}
          fontSize="11"
          fill="hsl(var(--muted-foreground))"
          textAnchor="middle"
        >
          {label.label}
        </text>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hover crosshair */}
      {hovered && (
        <>
          <line
            x1={hovered.x}
            y1={padding.top}
            x2={hovered.x}
            y2={padding.top + chartHeight}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          <circle
            cx={hovered.x}
            cy={hovered.y}
            r="5"
            fill="hsl(var(--background))"
            stroke={color}
            strokeWidth="2"
          />
          {/* Tooltip */}
          <rect
            x={hovered.x - 45}
            y={hovered.y - 34}
            width="90"
            height="24"
            rx="6"
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <text
            x={hovered.x}
            y={hovered.y - 18}
            fontSize="12"
            fontWeight="500"
            fill="hsl(var(--popover-foreground))"
            textAnchor="middle"
            className="font-mono"
          >
            {formatNumber(hovered.value)}
          </text>
        </>
      )}
    </svg>
  )
}
