import type {
  AnalyticsKPI,
  PlatformBreakdown,
  CreativePerformanceView,
  AnalyticsAIInsight,
  CampaignAnalytics,
  CampaignStatus,
} from '@repo/types'

export const mockAnalyticsKPIs: AnalyticsKPI[] = [
  { label: 'Total Reach', value: '12.4K', change: 23, trend: 'up' },
  { label: 'Engagement', value: '856', change: 12, trend: 'up' },
  { label: 'CTR', value: '3.2%', change: -0.4, trend: 'down' },
  { label: 'Clicks', value: '245', change: 8, trend: 'up' },
  { label: 'Saves', value: '42', change: 31, trend: 'up' },
]

export const mockPlatformBreakdown: PlatformBreakdown[] = [
  { platform: 'Instagram', percentage: 68, reach: 8432, engagement: 582, color: 'oklch(0.66 0.21 354)' },
  { platform: 'Facebook', percentage: 21, reach: 2604, engagement: 180, color: 'oklch(0.55 0.18 250)' },
  { platform: 'TikTok', percentage: 11, reach: 1364, engagement: 94, color: 'oklch(0.75 0.15 180)' },
]

export const mockTopCreatives: CreativePerformanceView[] = [
  {
    id: 'creative-1', name: 'Honor Her Story', campaignName: "Mother's Day Collection",
    platform: 'Instagram', format: 'Story', thumbnailUrl: 'https://placehold.co/200x350/1c1b1b/c5a55a?text=HHS',
    reach: 4200, impressions: 5800, engagementRate: 6.8, ctr: 5.1, clicks: 296, saves: 18,
    performanceScore: 92, performanceLabel: 'excellent', publishedAt: new Date('2026-02-25T10:00:00Z'),
  },
  {
    id: 'creative-2', name: 'Spring Awakening', campaignName: 'Spring 2026',
    platform: 'Instagram', format: 'Feed', thumbnailUrl: 'https://placehold.co/200x200/2d4a3e/a8d5ba?text=SA',
    reach: 3100, impressions: 4200, engagementRate: 5.2, ctr: 4.3, clicks: 181, saves: 12,
    performanceScore: 85, performanceLabel: 'excellent', publishedAt: new Date('2026-02-24T14:00:00Z'),
  },
  {
    id: 'creative-3', name: 'Timeless Heritage', campaignName: 'Brand Awareness Q1',
    platform: 'Facebook', format: 'Feed', thumbnailUrl: 'https://placehold.co/200x200/e6d3c1/1c1b1b?text=TH',
    reach: 2800, impressions: 3900, engagementRate: 3.9, ctr: 3.1, clicks: 121, saves: 8,
    performanceScore: 72, performanceLabel: 'good', publishedAt: new Date('2026-02-23T09:00:00Z'),
  },
  {
    id: 'creative-4', name: 'Fitness Friday', campaignName: 'Weekly Engagement',
    platform: 'TikTok', format: 'Video', thumbnailUrl: 'https://placehold.co/200x350/000000/00ff00?text=FF',
    reach: 1800, impressions: 2400, engagementRate: 4.5, ctr: 2.8, clicks: 67, saves: 3,
    performanceScore: 68, performanceLabel: 'good', publishedAt: new Date('2026-02-26T16:00:00Z'),
  },
  {
    id: 'creative-5', name: 'Ancient Craft', campaignName: 'Brand Awareness Q1',
    platform: 'Instagram', format: 'Story', thumbnailUrl: 'https://placehold.co/200x350/8b7355/ffffff?text=AC',
    reach: 500, impressions: 1600, engagementRate: 0.8, ctr: 0.3, clicks: 5, saves: 0,
    performanceScore: 18, performanceLabel: 'critical', publishedAt: new Date('2026-02-22T11:00:00Z'),
  },
]

export const mockTimeSeriesData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-02-01')
  date.setDate(date.getDate() + i)
  const base = 300 + Math.sin(i / 4) * 150
  return {
    date: date.toISOString().split('T')[0],
    reach: Math.round(base + ((i * 137 + 43) % 200)),
    engagement: Math.round((base + ((i * 89 + 67) % 200)) * 0.07),
  }
})

export const mockCampaignAnalytics: CampaignAnalytics[] = [
  {
    id: 'campaign-1', name: "Mother's Day Collection", brandName: 'Golden Horn Jewellery',
    status: 'PUBLISHED' as CampaignStatus, platforms: ['Instagram', 'Facebook'], creativeCount: 8,
    totalReach: 8200, totalEngagement: 558, avgCtr: 4.7, avgEngagementRate: 6.8,
    spend: 120, roas: 4.2, startDate: new Date('2026-02-20'), endDate: null,
  },
  {
    id: 'campaign-2', name: 'Spring 2026', brandName: 'Golden Horn Jewellery',
    status: 'PUBLISHED' as CampaignStatus, platforms: ['Instagram'], creativeCount: 5,
    totalReach: 5400, totalEngagement: 281, avgCtr: 3.8, avgEngagementRate: 5.2,
    spend: 80, roas: 3.5, startDate: new Date('2026-02-18'), endDate: null,
  },
  {
    id: 'campaign-3', name: 'Brand Awareness Q1', brandName: 'Golden Horn Jewellery',
    status: 'PUBLISHED' as CampaignStatus, platforms: ['Instagram', 'Facebook', 'TikTok'], creativeCount: 12,
    totalReach: 4600, totalEngagement: 179, avgCtr: 1.7, avgEngagementRate: 2.4,
    spend: 200, roas: 1.8, startDate: new Date('2026-02-10'), endDate: null,
  },
  {
    id: 'campaign-4', name: 'Weekly Engagement', brandName: 'Urban Fitness Co',
    status: 'PUBLISHED' as CampaignStatus, platforms: ['TikTok', 'Instagram'], creativeCount: 6,
    totalReach: 3200, totalEngagement: 144, avgCtr: 2.8, avgEngagementRate: 4.5,
    spend: 60, roas: 2.9, startDate: new Date('2026-02-15'), endDate: null,
  },
  {
    id: 'campaign-5', name: 'New Year Promo', brandName: 'Golden Horn Jewellery',
    status: 'COMPLETED' as CampaignStatus, platforms: ['Instagram', 'Facebook'], creativeCount: 10,
    totalReach: 15800, totalEngagement: 1106, avgCtr: 5.2, avgEngagementRate: 7.0,
    spend: 350, roas: 6.1, startDate: new Date('2025-12-20'), endDate: new Date('2026-01-05'),
  },
]

export const mockAIInsights: AnalyticsAIInsight[] = [
  { id: 'insight-1', type: 'success', title: 'Story format outperforms Feed', description: 'Your Instagram Stories have 2.3x higher CTR than Feed posts. Consider allocating more creatives to Stories.', metric: 'CTR +130%' },
  { id: 'insight-2', type: 'warning', title: '"Ancient Craft" underperforming', description: 'This creative has 0.3% CTR after 5 days. Autopilot has paused it. Consider replacing with a new variant.', metric: 'CTR 0.3%', creativeId: 'creative-5' },
  { id: 'insight-3', type: 'suggestion', title: 'Best posting time: 10:00-11:00', description: 'Your audience is most active between 10-11 AM. Schedule high-priority content in this window.', metric: '+45% engagement' },
  { id: 'insight-4', type: 'trend', title: 'Engagement trending up', description: 'Overall engagement has increased 12% this week compared to last week. Keep the momentum going!', metric: '+12% weekly' },
  { id: 'insight-5', type: 'suggestion', title: 'Add TikTok to your mix', description: 'Your TikTok content reaches a younger demographic with 4.5% engagement rate. Scale up TikTok creatives.', metric: '4.5% engagement' },
]
