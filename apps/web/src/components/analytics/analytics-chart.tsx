'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'

interface DataPoint {
  date: string
  reach: number
  engagement: number
}

export function AnalyticsChart({ data }: { data: DataPoint[] }) {
  const maxReach = Math.max(...data.map(d => d.reach))
  const maxEng = Math.max(...data.map(d => d.engagement))
  const svgW = 800
  const svgH = 300
  const padX = 40
  const padY = 20

  function toX(i: number) { return padX + (i / (data.length - 1)) * (svgW - padX * 2) }
  function toYReach(v: number) { return svgH - padY - ((v / maxReach) * (svgH - padY * 2)) }
  function toYEng(v: number) { return svgH - padY - ((v / maxEng) * (svgH - padY * 2)) }

  const reachPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toYReach(d.reach)}`).join(' ')
  const engPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toYEng(d.engagement)}`).join(' ')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'oklch(0.66 0.21 354)' }} />
            Reach
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'oklch(0.75 0.15 180)' }} />
            Engagement
          </span>
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <line key={f} x1={padX} y1={padY + f * (svgH - padY * 2)} x2={svgW - padX} y2={padY + f * (svgH - padY * 2)}
              stroke="oklch(1 0 0 / 8%)" strokeWidth="1" />
          ))}
          {/* Reach line */}
          <path d={reachPath} fill="none" stroke="oklch(0.66 0.21 354)" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Engagement line */}
          <path d={engPath} fill="none" stroke="oklch(0.75 0.15 180)" strokeWidth="2.5" strokeLinejoin="round" />
          {/* X axis labels */}
          {data.filter((_, i) => i % 7 === 0).map((d, i) => (
            <text key={d.date} x={toX(i * 7)} y={svgH - 2} textAnchor="middle"
              className="fill-muted-foreground text-[10px]">
              {d.date.slice(5)}
            </text>
          ))}
        </svg>
      </CardContent>
    </Card>
  )
}
