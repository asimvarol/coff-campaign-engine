import { Camera, CalendarCheck, Coins } from 'lucide-react'
import { Card, CardContent } from '@repo/ui'

interface PhotoshootStatsProps {
  totalShoots: number
  thisMonth: number
  creditsUsed: number
}

export function PhotoshootStats({ totalShoots, thisMonth, creditsUsed }: PhotoshootStatsProps) {
  const stats = [
    {
      label: 'Total Photoshoots',
      value: totalShoots,
      icon: Camera,
      color: 'text-primary',
    },
    {
      label: 'This Month',
      value: thisMonth,
      icon: CalendarCheck,
      color: 'text-blue-500',
    },
    {
      label: 'Credits Used',
      value: creditsUsed,
      icon: Coins,
      color: 'text-amber-500',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
