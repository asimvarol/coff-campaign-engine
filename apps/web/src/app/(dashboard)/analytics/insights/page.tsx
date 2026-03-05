'use client'

import { useState, useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui'
import {
  Lightbulb01Icon,
  AlertCircle01Icon,
  TrendUp01Icon,
  Eye01Icon,
  Magic01Icon,
  Loading03Icon,
} from '@/lib/icons'
import type { AIInsight } from '@repo/types'

// TODO: Fetch from API
const mockAIInsights: AIInsight[] = []

const insightIcons = {
  alert: AlertCircle01Icon,
  optimization: TrendUp01Icon,
  trend: TrendUp01Icon,
  audience: Eye01Icon,
}

const severityColors = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  critical: 'bg-destructive/10 text-destructive border-destructive/30',
}

export default function InsightsPage() {
  useEffect(() => { document.title = 'AI Insights | Coff' }, [])

  const [insights, setInsights] = useState<AIInsight[]>(mockAIInsights)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)

  const rotatingInsights: Omit<AIInsight, 'id' | 'createdAt' | 'isRead'>[] = [
    { type: 'optimization', title: 'Carousel Format Trending', description: 'Carousel posts have 2.1x higher save rate compared to single image posts.', affectedEntity: null, suggestedAction: 'Create more carousel content for upcoming campaigns.', severity: 'medium' },
    { type: 'trend', title: 'Video Content Rising', description: 'Short-form video content shows 3.2x higher engagement than static posts this week.', affectedEntity: null, suggestedAction: 'Allocate more budget to Reels and TikTok formats.', severity: 'low' },
    { type: 'audience', title: 'New Audience Segment', description: '25-34 age group engagement increased by 45% after latest campaign launch.', affectedEntity: null, suggestedAction: 'Create targeted content for this high-growth segment.', severity: 'medium' },
    { type: 'alert', title: 'Facebook Reach Declining', description: 'Facebook organic reach dropped 22% over the past 2 weeks.', affectedEntity: null, suggestedAction: 'Consider boosting top-performing posts or adjusting posting schedule.', severity: 'high' },
  ]

  const handleGenerateInsights = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const template = rotatingInsights[insights.length % rotatingInsights.length]
    const newInsight: AIInsight = {
      ...template,
      id: `insight-${Date.now()}`,
      createdAt: new Date(),
      isRead: false,
    }

    setInsights([newInsight, ...insights])
    setIsGenerating(false)
  }

  const handleDismiss = (insightId: string) => {
    setInsights(insights.filter((i) => i.id !== insightId))
  }

  const markAsRead = (insightId: string) => {
    setInsights(insights.map((i) => (i.id === insightId ? { ...i, isRead: true } : i)))
  }

  const unreadCount = insights.filter((i) => !i.isRead).length

  return (
    <div >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Insights</h1>
          <p className="text-muted-foreground">
            AI-generated recommendations and performance alerts
          </p>
        </div>
        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Magic01Icon size={18} />
          {isGenerating ? 'Generating...' : 'Generate New Insights (2 credits)'}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Insights</CardDescription>
            <CardTitle className="text-2xl font-mono">{insights.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread</CardDescription>
            <CardTitle className="text-2xl text-primary font-mono">{unreadCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Alerts</CardDescription>
            <CardTitle className="text-2xl text-destructive font-mono">
              {insights.filter((i) => i.severity === 'critical').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Actions Suggested</CardDescription>
            <CardTitle className="text-2xl font-mono">
              {insights.filter((i) => i.suggestedAction).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Loading indicator */}
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loading03Icon className="h-4 w-4 animate-spin" />
          <span>Generating new insights...</span>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insightIcons[insight.type]
          const severityColor = severityColors[insight.severity]

          return (
            <Card
              key={insight.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                !insight.isRead ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => {
                setSelectedInsight(insight)
                markAsRead(insight.id)
              }}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      insight.type === 'alert' ? 'bg-destructive/10' : 'bg-primary/10'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={insight.type === 'alert' ? 'text-destructive' : 'text-primary'}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${severityColor}`}>
                        {insight.severity}
                      </span>
                    </div>

                    {insight.affectedEntity && (
                      <div className="mb-2 inline-block rounded-md bg-muted px-2 py-1 text-xs">
                        <span className="text-muted-foreground">
                          {insight.affectedEntity.type === 'campaign' ? '📊' : '🎨'}{' '}
                          {insight.affectedEntity.name}
                        </span>
                      </div>
                    )}

                    {insight.suggestedAction && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          💡 Suggested Action:
                        </p>
                        <p className="text-sm">{insight.suggestedAction}</p>
                        <div className="mt-3 flex gap-2">
                          <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                            Take Action
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDismiss(insight.id) }}
                            className="rounded-md bg-background px-3 py-1 text-xs font-medium hover:bg-muted"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(insight.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {insights.length === 0 && (
        <Card>
          <CardContent className="flex h-48 flex-col items-center justify-center gap-4">
            <Lightbulb01Icon size={48} className="text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No insights yet</p>
              <p className="text-sm text-muted-foreground">
                Generate AI insights to get performance recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedInsight?.title}</DialogTitle>
            <DialogDescription>
              {selectedInsight && new Date(selectedInsight.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedInsight && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedInsight.description}</p>
              </div>

              {selectedInsight.affectedEntity && (
                <div>
                  <h4 className="mb-2 font-medium">Affected {selectedInsight.affectedEntity.type}</h4>
                  <p className="text-sm">{selectedInsight.affectedEntity.name}</p>
                </div>
              )}

              {selectedInsight.suggestedAction && (
                <div>
                  <h4 className="mb-2 font-medium">Suggested Action</h4>
                  <p className="text-sm">{selectedInsight.suggestedAction}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Take Action</Button>
                <Button variant="secondary" onClick={() => setSelectedInsight(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
