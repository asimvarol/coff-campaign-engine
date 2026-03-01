'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { AnalyticsAIInsight } from '@repo/types'


const typeConfig: Record<string, { badge: 'default' | 'secondary' | 'destructive' | 'outline'; emoji: string }> = {
  success: { badge: 'default', emoji: '✅' },
  warning: { badge: 'destructive', emoji: '⚠️' },
  suggestion: { badge: 'secondary', emoji: '💡' },
  trend: { badge: 'outline', emoji: '📈' },
}

export function AnalyticsAIInsights({ insights }: { insights: AnalyticsAIInsight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✨
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type] || typeConfig.suggestion
          return (
            <div key={insight.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{config.emoji}</span>
                <span className="text-sm font-medium">{insight.title}</span>
                {insight.metric && (
                  <Badge variant={config.badge} className="ml-auto text-xs">{insight.metric}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
