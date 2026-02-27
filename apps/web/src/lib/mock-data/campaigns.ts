import type { CampaignObjective, CampaignStatus, CampaignConcept } from '@repo/types'

// Mock Brand DNA for testing
export const mockBrands = [
  {
    id: 'brand-1',
    name: 'Golden Horn Jewellery',
    logo: { primary: 'https://placehold.co/200x200/1c1b1b/e6d3c1?text=GH', variants: [] },
    colors: {
      primary: '#1c1b1b',
      secondary: '#e6d3c1',
      accent: '#c5a55a',
      background: '#ffffff',
      text: '#1c1b1b',
      palette: ['#1c1b1b', '#e6d3c1', '#c5a55a', '#f5f0ea', '#8b7355'],
    },
  },
  {
    id: 'brand-2',
    name: 'Urban Fitness Co',
    logo: { primary: 'https://placehold.co/200x200/000000/00ff00?text=UFC', variants: [] },
    colors: {
      primary: '#000000',
      secondary: '#00ff00',
      accent: '#ff6b00',
      background: '#ffffff',
      text: '#000000',
      palette: ['#000000', '#00ff00', '#ff6b00', '#ffffff', '#333333'],
    },
  },
]

// Mock Campaigns
export interface MockCampaign {
  id: string
  name: string
  brandId: string
  brandName: string
  brandLogo: string
  objective: CampaignObjective
  status: CampaignStatus
  platforms: string[]
  creativeCount: number
  createdAt: Date
  updatedAt: Date
}

export const mockCampaigns: MockCampaign[] = [
  {
    id: 'campaign-1',
    name: "Mother's Day - Honor Her Story",
    brandId: 'brand-1',
    brandName: 'Golden Horn Jewellery',
    brandLogo: 'https://placehold.co/200x200/1c1b1b/e6d3c1?text=GH',
    objective: 'SEASONAL' as CampaignObjective,
    status: 'PUBLISHED' as CampaignStatus,
    platforms: ['instagram', 'facebook', 'pinterest'],
    creativeCount: 12,
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-25'),
  },
  {
    id: 'campaign-2',
    name: 'Spring Collection Launch',
    brandId: 'brand-1',
    brandName: 'Golden Horn Jewellery',
    brandLogo: 'https://placehold.co/200x200/1c1b1b/e6d3c1?text=GH',
    objective: 'PRODUCT_LAUNCH' as CampaignObjective,
    status: 'REVIEW' as CampaignStatus,
    platforms: ['instagram', 'facebook', 'tiktok', 'pinterest'],
    creativeCount: 16,
    createdAt: new Date('2026-02-22'),
    updatedAt: new Date('2026-02-26'),
  },
  {
    id: 'campaign-3',
    name: 'Heritage Collection Awareness',
    brandId: 'brand-1',
    brandName: 'Golden Horn Jewellery',
    brandLogo: 'https://placehold.co/200x200/1c1b1b/e6d3c1?text=GH',
    objective: 'AWARENESS' as CampaignObjective,
    status: 'GENERATING' as CampaignStatus,
    platforms: ['instagram', 'linkedin', 'x'],
    creativeCount: 8,
    createdAt: new Date('2026-02-26'),
    updatedAt: new Date('2026-02-27'),
  },
  {
    id: 'campaign-4',
    name: 'Summer Fitness Challenge',
    brandId: 'brand-2',
    brandName: 'Urban Fitness Co',
    brandLogo: 'https://placehold.co/200x200/000000/00ff00?text=UFC',
    objective: 'ENGAGEMENT' as CampaignObjective,
    status: 'DRAFT' as CampaignStatus,
    platforms: ['instagram', 'facebook', 'tiktok'],
    creativeCount: 0,
    createdAt: new Date('2026-02-27'),
    updatedAt: new Date('2026-02-27'),
  },
  {
    id: 'campaign-5',
    name: 'Valentine\'s Day - Timeless Love',
    brandId: 'brand-1',
    brandName: 'Golden Horn Jewellery',
    brandLogo: 'https://placehold.co/200x200/1c1b1b/e6d3c1?text=GH',
    objective: 'CONVERSION' as CampaignObjective,
    status: 'PAUSED' as CampaignStatus,
    platforms: ['instagram', 'facebook', 'google-ads'],
    creativeCount: 10,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-15'),
  },
]

// Mock Campaign Concepts
export const mockConcepts: CampaignConcept[] = [
  {
    name: 'Heritage & Elegance',
    description: 'Celebrate the timeless beauty of traditional craftsmanship with modern elegance. Focus on intricate details and the stories behind each piece.',
    emotion: 'Nostalgic Pride',
    hashtags: ['#TimelessElegance', '#HeritageJewellery', '#CraftsmanshipMatters', '#ModernTradition'],
    colorMood: 'Warm earth tones with gold accents',
    textPosition: 'bottom',
  },
  {
    name: 'Empowered Femininity',
    description: 'Honor the strength and grace of women through bold, statement pieces. Showcase confidence and self-expression.',
    emotion: 'Empowerment',
    hashtags: ['#EmpoweredWomen', '#ConfidentStyle', '#StatementJewellery', '#SheShines'],
    colorMood: 'Deep blacks with rose gold highlights',
    textPosition: 'top',
  },
  {
    name: 'Sentimental Journey',
    description: 'Every piece tells a story—of love, memory, and cherished moments. Create an emotional connection through storytelling.',
    emotion: 'Warmth & Nostalgia',
    hashtags: ['#StoriesThatShine', '#SentimentalValue', '#CherishedMoments', '#LoveInEveryDetail'],
    colorMood: 'Soft pastels with warm lighting',
    textPosition: 'center',
  },
  {
    name: 'Minimalist Luxury',
    description: 'Less is more. Showcase clean lines, subtle elegance, and the beauty of simplicity with high-end appeal.',
    emotion: 'Sophisticated Calm',
    hashtags: ['#MinimalistStyle', '#QuietLuxury', '#ElegantSimplicity', '#TimelessDesign'],
    colorMood: 'Monochrome with subtle gold',
    textPosition: 'top',
  },
  {
    name: 'Celebration of Tradition',
    description: 'Bring cultural heritage to life with rich colors, symbolic patterns, and the artistry passed down through generations.',
    emotion: 'Cultural Pride',
    hashtags: ['#CulturalHeritage', '#TraditionalArt', '#ArtisanCraft', '#RootsAndRituals'],
    colorMood: 'Rich jewel tones with traditional patterns',
    textPosition: 'bottom',
  },
]

// Mock Creative Data
export interface MockCreative {
  id: string
  campaignId: string
  platform: string
  format: string
  width: number
  height: number
  imageUrl: string
  header: {
    text: string
    font: string
    size: number
    color: string
    position: { x: number; y: number }
    visible: boolean
  }
  description: {
    text: string
    font: string
    size: number
    color: string
    position: { x: number; y: number }
    visible: boolean
  }
  cta: {
    text: string
    style: string
    url: string
    visible: boolean
  }
  overlay: {
    color: string
    opacity: number
  }
  version: number
  status: string
  createdAt: Date
}

export const mockCreatives: MockCreative[] = [
  {
    id: 'creative-1',
    campaignId: 'campaign-1',
    platform: 'instagram',
    format: 'story',
    width: 1080,
    height: 1920,
    imageUrl: 'https://placehold.co/1080x1920/1c1b1b/e6d3c1?text=Story+1',
    header: {
      text: 'HONOR HER STORY',
      font: 'Playfair Display',
      size: 48,
      color: '#ffffff',
      position: { x: 50, y: 200 },
      visible: true,
    },
    description: {
      text: 'Celebrating the women who inspire us',
      font: 'Outfit',
      size: 18,
      color: '#e6d3c1',
      position: { x: 50, y: 280 },
      visible: true,
    },
    cta: {
      text: 'Shop Now',
      style: 'primary',
      url: 'https://goldenhornshop.com',
      visible: true,
    },
    overlay: {
      color: '#000000',
      opacity: 0.4,
    },
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'creative-2',
    campaignId: 'campaign-1',
    platform: 'instagram',
    format: 'feed',
    width: 1080,
    height: 1080,
    imageUrl: 'https://placehold.co/1080x1080/1c1b1b/c5a55a?text=Feed+1',
    header: {
      text: "Mother's Day",
      font: 'Playfair Display',
      size: 42,
      color: '#ffffff',
      position: { x: 50, y: 100 },
      visible: true,
    },
    description: {
      text: 'Timeless pieces for timeless love',
      font: 'Outfit',
      size: 16,
      color: '#e6d3c1',
      position: { x: 50, y: 170 },
      visible: true,
    },
    cta: {
      text: 'Explore Collection',
      style: 'primary',
      url: 'https://goldenhornshop.com',
      visible: true,
    },
    overlay: {
      color: '#000000',
      opacity: 0.3,
    },
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'creative-3',
    campaignId: 'campaign-1',
    platform: 'facebook',
    format: 'feed',
    width: 1200,
    height: 630,
    imageUrl: 'https://placehold.co/1200x630/1c1b1b/e6d3c1?text=FB+Feed',
    header: {
      text: 'A Gift She Will Treasure Forever',
      font: 'Playfair Display',
      size: 36,
      color: '#ffffff',
      position: { x: 50, y: 100 },
      visible: true,
    },
    description: {
      text: 'Handcrafted jewellery with meaning',
      font: 'Outfit',
      size: 14,
      color: '#e6d3c1',
      position: { x: 50, y: 160 },
      visible: true,
    },
    cta: {
      text: 'Shop Mother\'s Day',
      style: 'primary',
      url: 'https://goldenhornshop.com',
      visible: true,
    },
    overlay: {
      color: '#000000',
      opacity: 0.35,
    },
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'creative-4',
    campaignId: 'campaign-2',
    platform: 'instagram',
    format: 'reels',
    width: 1080,
    height: 1920,
    imageUrl: 'https://placehold.co/1080x1920/c5a55a/1c1b1b?text=Reels',
    header: {
      text: 'SPRING AWAKENS',
      font: 'Playfair Display',
      size: 52,
      color: '#1c1b1b',
      position: { x: 50, y: 250 },
      visible: true,
    },
    description: {
      text: 'New collection drops March 1st',
      font: 'Outfit',
      size: 20,
      color: '#1c1b1b',
      position: { x: 50, y: 330 },
      visible: true,
    },
    cta: {
      text: 'Set Reminder',
      style: 'secondary',
      url: 'https://goldenhornshop.com/spring',
      visible: true,
    },
    overlay: {
      color: '#ffffff',
      opacity: 0.15,
    },
    version: 1,
    status: 'REVIEW',
    createdAt: new Date('2026-02-26'),
  },
]

// Generator functions
export function generateMockConcepts(
  brandId: string,
  objective: CampaignObjective,
  platforms: string[]
): CampaignConcept[] {
  // Simulate AI generation delay
  return mockConcepts.slice(0, 4)
}

export async function generateMockCreatives(
  campaignId: string,
  concept: CampaignConcept,
  platforms: string[],
  brandColors: { primary: string; secondary: string; accent: string }
): Promise<MockCreative[]> {
  // Simulate generation with delay
  const creatives: MockCreative[] = []
  
  platforms.forEach((platform, idx) => {
    if (platform === 'instagram') {
      // Story
      creatives.push({
        id: `creative-${Date.now()}-${idx}-story`,
        campaignId,
        platform: 'instagram',
        format: 'story',
        width: 1080,
        height: 1920,
        imageUrl: `https://placehold.co/1080x1920/${brandColors.primary.replace('#', '')}/${brandColors.secondary.replace('#', '')}?text=IG+Story`,
        header: {
          text: concept.name.toUpperCase(),
          font: 'Playfair Display',
          size: 48,
          color: '#ffffff',
          position: { x: 50, y: 200 },
          visible: true,
        },
        description: {
          text: concept.description.substring(0, 60) + '...',
          font: 'Outfit',
          size: 18,
          color: brandColors.secondary,
          position: { x: 50, y: 280 },
          visible: true,
        },
        cta: {
          text: 'Shop Now',
          style: 'primary',
          url: 'https://example.com',
          visible: true,
        },
        overlay: {
          color: '#000000',
          opacity: 0.4,
        },
        version: 1,
        status: 'DRAFT',
        createdAt: new Date(),
      })
      
      // Feed
      creatives.push({
        id: `creative-${Date.now()}-${idx}-feed`,
        campaignId,
        platform: 'instagram',
        format: 'feed',
        width: 1080,
        height: 1080,
        imageUrl: `https://placehold.co/1080x1080/${brandColors.primary.replace('#', '')}/${brandColors.accent.replace('#', '')}?text=IG+Feed`,
        header: {
          text: concept.name,
          font: 'Playfair Display',
          size: 42,
          color: '#ffffff',
          position: { x: 50, y: 100 },
          visible: true,
        },
        description: {
          text: concept.description.substring(0, 50) + '...',
          font: 'Outfit',
          size: 16,
          color: brandColors.secondary,
          position: { x: 50, y: 170 },
          visible: true,
        },
        cta: {
          text: 'Learn More',
          style: 'primary',
          url: 'https://example.com',
          visible: true,
        },
        overlay: {
          color: '#000000',
          opacity: 0.3,
        },
        version: 1,
        status: 'DRAFT',
        createdAt: new Date(),
      })
    }
    
    if (platform === 'facebook') {
      creatives.push({
        id: `creative-${Date.now()}-${idx}-fb`,
        campaignId,
        platform: 'facebook',
        format: 'feed',
        width: 1200,
        height: 630,
        imageUrl: `https://placehold.co/1200x630/${brandColors.primary.replace('#', '')}/${brandColors.secondary.replace('#', '')}?text=FB+Feed`,
        header: {
          text: concept.name,
          font: 'Playfair Display',
          size: 36,
          color: '#ffffff',
          position: { x: 50, y: 100 },
          visible: true,
        },
        description: {
          text: concept.description.substring(0, 70) + '...',
          font: 'Outfit',
          size: 14,
          color: brandColors.secondary,
          position: { x: 50, y: 160 },
          visible: true,
        },
        cta: {
          text: 'Shop Now',
          style: 'primary',
          url: 'https://example.com',
          visible: true,
        },
        overlay: {
          color: '#000000',
          opacity: 0.35,
        },
        version: 1,
        status: 'DRAFT',
        createdAt: new Date(),
      })
    }
    
    if (platform === 'tiktok') {
      creatives.push({
        id: `creative-${Date.now()}-${idx}-tt`,
        campaignId,
        platform: 'tiktok',
        format: 'video',
        width: 1080,
        height: 1920,
        imageUrl: `https://placehold.co/1080x1920/${brandColors.accent.replace('#', '')}/${brandColors.primary.replace('#', '')}?text=TikTok`,
        header: {
          text: concept.name.toUpperCase(),
          font: 'Outfit',
          size: 52,
          color: '#ffffff',
          position: { x: 50, y: 250 },
          visible: true,
        },
        description: {
          text: concept.description.substring(0, 50),
          font: 'Outfit',
          size: 20,
          color: '#ffffff',
          position: { x: 50, y: 330 },
          visible: true,
        },
        cta: {
          text: 'Watch More',
          style: 'secondary',
          url: 'https://example.com',
          visible: true,
        },
        overlay: {
          color: '#000000',
          opacity: 0.25,
        },
        version: 1,
        status: 'DRAFT',
        createdAt: new Date(),
      })
    }
  })
  
  return creatives
}

// Campaign stats calculation
export function getCampaignStats() {
  return {
    total: mockCampaigns.length,
    active: mockCampaigns.filter(c => ['PUBLISHED', 'GENERATING', 'REVIEW'].includes(c.status)).length,
    published: mockCampaigns.filter(c => c.status === 'PUBLISHED').length,
    totalCreatives: mockCampaigns.reduce((sum, c) => sum + c.creativeCount, 0),
  }
}
