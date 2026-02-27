// Brand DNA Types
export interface BrandDNA {
  id: string
  name: string
  url: string | null
  logo: BrandLogo
  colors: BrandColors
  typography: BrandTypography
  voice: BrandVoice
  values: string[]
  aesthetic: string[]
  industry: string | null
  targetAudience: string | null
  summary: string | null
  images: BrandImages
  socialProfiles: SocialProfiles | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BrandLogo {
  primary: string
  variants: string[]
}

export interface BrandColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  palette: string[]
}

export interface BrandTypography {
  heading: string
  body: string
  accent?: string
}

export interface BrandVoice {
  tone: string[]
  personality: string[]
  keywords: string[]
  sampleTexts: string[]
}

export interface BrandImages {
  scraped: string[]
  uploaded: string[]
  products: string[]
}

export interface SocialProfiles {
  instagram?: string
  facebook?: string
  tiktok?: string
  linkedin?: string
  x?: string
  pinterest?: string
}

// Campaign Types
export enum CampaignObjective {
  AWARENESS = 'AWARENESS',
  ENGAGEMENT = 'ENGAGEMENT',
  CONVERSION = 'CONVERSION',
  TRAFFIC = 'TRAFFIC',
  PRODUCT_LAUNCH = 'PRODUCT_LAUNCH',
  SEASONAL = 'SEASONAL',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface CampaignConcept {
  name: string
  description: string
  emotion: string
  hashtags: string[]
  colorMood: string
  textPosition: 'top' | 'center' | 'bottom'
}

// Creative Types
export enum PublishStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED',
}

export interface TextConfig {
  text: string
  font: string
  size: number
  color: string
  position: { x: number; y: number }
  visible: boolean
}

export interface CTAConfig {
  text: string
  style: string
  url?: string
  visible: boolean
}

export interface OverlayConfig {
  color: string
  opacity: number
}

// Creative Format Types
export interface CreativeFormat {
  width: number
  height: number
  label: string
  maxSlides?: number
}

export const CREATIVE_FORMATS: Record<string, Record<string, CreativeFormat>> = {
  instagram: {
    feed: { width: 1080, height: 1080, label: 'Instagram Feed (1:1)' },
    feedPortrait: { width: 1080, height: 1350, label: 'Instagram Feed (4:5)' },
    story: { width: 1080, height: 1920, label: 'Instagram Story (9:16)' },
    reels: { width: 1080, height: 1920, label: 'Instagram Reels (9:16)' },
    carousel: { width: 1080, height: 1080, label: 'Instagram Carousel', maxSlides: 10 },
  },
  facebook: {
    feed: { width: 1200, height: 630, label: 'Facebook Feed' },
    story: { width: 1080, height: 1920, label: 'Facebook Story' },
    cover: { width: 820, height: 312, label: 'Facebook Cover' },
    ad: { width: 1200, height: 628, label: 'Facebook Ad' },
  },
  tiktok: {
    video: { width: 1080, height: 1920, label: 'TikTok Video (9:16)' },
    photo: { width: 1080, height: 1920, label: 'TikTok Photo' },
  },
  linkedin: {
    post: { width: 1200, height: 627, label: 'LinkedIn Post' },
    carousel: { width: 1080, height: 1080, label: 'LinkedIn Carousel PDF' },
    banner: { width: 1584, height: 396, label: 'LinkedIn Banner' },
  },
  x: {
    post: { width: 1600, height: 900, label: 'X/Twitter Post (16:9)' },
    header: { width: 1500, height: 500, label: 'X Header' },
  },
  pinterest: {
    pin: { width: 1000, height: 1500, label: 'Pinterest Pin (2:3)' },
    ideaPin: { width: 1080, height: 1920, label: 'Pinterest Idea Pin' },
  },
  youtube: {
    thumbnail: { width: 1280, height: 720, label: 'YouTube Thumbnail' },
    short: { width: 1080, height: 1920, label: 'YouTube Short' },
  },
  googleAds: {
    leaderboard: { width: 728, height: 90, label: 'Leaderboard' },
    mediumRect: { width: 300, height: 250, label: 'Medium Rectangle' },
    largeRect: { width: 336, height: 280, label: 'Large Rectangle' },
    responsive: { width: 1200, height: 628, label: 'Responsive Display' },
  },
}

// Performance Types
export interface CreativePerformance {
  creativeId: string
  platform: string
  postUrl: string | null
  publishedAt: Date | null
  reach: number
  impressions: number
  frequency: number
  likes: number
  comments: number
  shares: number
  saves: number
  engagementRate: number
  clicks: number
  ctr: number
  linkClicks: number
  videoViews: number | null
  avgWatchTime: number | null
  completionRate: number | null
  spend: number | null
  cpc: number | null
  cpm: number | null
  roas: number | null
  performanceScore: number
  performanceLabel: 'excellent' | 'good' | 'average' | 'poor' | 'critical'
  aiInsight: string | null
  aiSuggestion: string | null
}

// Autopilot Types
export interface AutopilotCondition {
  metric: 'ctr' | 'engagementRate' | 'reach' | 'cpc' | 'roas' | 'performanceScore'
  operator: 'lt' | 'gt' | 'eq' | 'between'
  value: number
  timeWindow: '6h' | '12h' | '24h' | '48h' | '7d'
  platform?: string
}

export interface AutopilotAction {
  type: 'pause' | 'replace' | 'notify' | 'boost' | 'reschedule'
  config: {
    replaceStrategy?: 'regenerate' | 'next_variant' | 'best_performing_clone'
    notifyChannels?: ('email' | 'push' | 'webhook' | 'slack')[]
    boostMultiplier?: number
    rescheduleStrategy?: 'best_time' | 'specific_time'
  }
}

// Agency Types
export enum AgencyRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  code?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Queue Job Types
export interface BrandAnalyzeJob {
  url: string
  userId: string
  brandId: string
}

export interface CampaignGenerateConceptsJob {
  campaignId: string
}

export interface CampaignGenerateCreativesJob {
  campaignId: string
  conceptIndex: number
}

export interface CreativeGenerateImageJob {
  creativeId: string
  prompt: string
}

export interface PublishPostJob {
  scheduleId: string
}

export interface AnalyticsFetchJob {
  creativeId: string
}

export interface AutopilotCheckJob {
  creativeId: string
}

// Photoshoot Types
export enum PhotoshootStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PhotoshootTemplate {
  MINIMALIST = 'Minimalist Studio',
  LIFESTYLE = 'Lifestyle Scene',
  NATURE = 'Nature/Outdoor',
  LUXURY = 'Luxury',
  SEASONAL = 'Seasonal',
  ABSTRACT = 'Abstract',
  FLAT_LAY = 'Flat Lay',
  IN_USE = 'In Use',
}

export interface PhotoshootVariant {
  id: string
  template: PhotoshootTemplate
  imageUrl: string
  prompt: string
  selected: boolean
}

export interface Photoshoot {
  id: string
  name: string
  productImageUrl: string
  productImageNoBackground: string | null
  brandDnaId: string | null
  brandDnaName: string | null
  status: PhotoshootStatus
  creditCost: number
  variants: PhotoshootVariant[]
  selectedVariantIds: string[]
  createdAt: Date
  completedAt: Date | null
}

export interface PhotoshootGenerateRequest {
  productImageUrl: string
  brandDnaId?: string
  templates: PhotoshootTemplate[]
}

export interface PhotoshootListRequest {
  page?: number
  limit?: number
  status?: PhotoshootStatus
}

// Analytics Types (from main - simple KPI views)
export type AnalyticsDateRange = '7d' | '30d' | '90d' | 'custom'
export interface AnalyticsKPI { label: string; value: string; change: number; trend: 'up' | 'down' | 'flat' }
export interface CreativePerformanceView { id: string; name: string; campaignName: string; platform: string; format: string; thumbnailUrl: string; reach: number; impressions: number; engagementRate: number; ctr: number; clicks: number; saves: number; performanceScore: number; performanceLabel: 'excellent' | 'good' | 'average' | 'poor' | 'critical'; publishedAt: Date }
export interface AnalyticsAIInsight { id: string; type: 'success' | 'warning' | 'suggestion' | 'trend'; title: string; description: string; metric?: string; creativeId?: string }
export interface CampaignAnalytics { id: string; name: string; brandName: string; status: CampaignStatus; platforms: string[]; creativeCount: number; totalReach: number; totalEngagement: number; avgCtr: number; avgEngagementRate: number; spend: number; roas: number; startDate: Date; endDate: Date | null }

// Agency additional types (AgencyRole enum already exists above)
export type AgencyPlan = 'FREE' | 'PRO' | 'ENTERPRISE'
export interface AgencyMember { id: string; name: string; email: string; avatarUrl: string | null; role: AgencyRole; brandAccess: string[]; lastActiveAt: Date; invitedAt: Date; acceptedAt: Date | null }
export interface AgencyBrand { id: string; name: string; logoUrl: string; industry: string; campaignCount: number; creativeCount: number; creditsUsed: number; avgPerformance: number; lastActivity: Date }
export interface AgencyBillingEntry { id: string; brandId: string; brandName: string; action: string; credits: number; date: Date; userId: string; userName: string }
export interface TeamActivity { id: string; userId: string; userName: string; userAvatar: string | null; action: string; target: string; brandId: string | null; brandName: string | null; createdAt: Date }
export interface Agency { id: string; name: string; plan: AgencyPlan; members: AgencyMember[]; brands: AgencyBrand[]; totalCreditsUsed: number; totalCreditsRemaining: number; monthlySpend: number; createdAt: Date }

// Analytics Types (from analytics feature - detailed metrics)
export interface AnalyticsOverview {
  totalReach: number
  totalReachChange: number
  totalEngagement: number
  totalEngagementChange: number
  avgCtr: number
  avgCtrChange: number
  totalClicks: number
  totalClicksChange: number
  totalSaves: number
  totalSavesChange: number
}

export interface ReachTrendDataPoint {
  date: string
  reach: number
  engagement: number
  clicks: number
}

export interface PlatformBreakdown {
  platform: string
  reach: number
  engagement: number
  clicks: number
  percentage: number
  color?: string
}

export interface CampaignMetrics {
  campaignId: string
  campaignName: string
  brandName: string
  reach: number
  engagement: number
  ctr: number
  clicks: number
  score: number
}

export interface CreativeMetrics extends CreativePerformance {
  creativeName: string
  campaignName: string
  thumbnailUrl: string
}

export interface AIInsight {
  id: string
  type: 'alert' | 'optimization' | 'trend' | 'audience'
  title: string
  description: string
  affectedEntity: {
    type: 'campaign' | 'creative'
    id: string
    name: string
  } | null
  suggestedAction: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  isRead: boolean
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'weekly' | 'monthly' | 'campaign' | 'custom'
  includesSections: string[]
}

export interface GeneratedReport {
  id: string
  templateId: string
  templateName: string
  dateRange: { start: Date; end: Date }
  generatedAt: Date
  format: 'pdf' | 'csv'
  downloadUrl: string | null
}

export interface ScheduledReport {
  id: string
  templateId: string
  templateName: string
  frequency: 'daily' | 'weekly' | 'monthly'
  nextRunAt: Date
  recipients: string[]
  isActive: boolean
}
