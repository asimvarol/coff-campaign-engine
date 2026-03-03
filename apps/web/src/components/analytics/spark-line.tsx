'use client'

interface SparkLineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  showFill?: boolean
}

export function SparkLine({
  data,
  color = 'oklch(0.66 0.21 354)',
  width = 60,
  height = 20,
  showFill = true,
}: SparkLineProps) {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} />
  }

  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const valueRange = maxValue - minValue || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - minValue) / valueRange) * height
    return { x, y }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const areaD = showFill
    ? `${pathD} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`
    : ''

  return (
    <svg width={width} height={height} className="inline-block">
      {showFill && <path d={areaD} fill={color} fillOpacity="0.2" />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
