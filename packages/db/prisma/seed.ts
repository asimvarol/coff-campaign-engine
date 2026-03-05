import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.autopilotLog.deleteMany()
  await prisma.autopilotRule.deleteMany()
  await prisma.creativePerformance.deleteMany()
  await prisma.publishSchedule.deleteMany()
  await prisma.photoshootVariant.deleteMany()
  await prisma.photoshoot.deleteMany()
  await prisma.creative.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.socialAccount.deleteMany()
  await prisma.agencyMember.deleteMany()
  await prisma.agency.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  // User
  const user = await prisma.user.create({
    data: {
      email: 'demo@coff.ai',
      name: 'Demo User',
    },
  })

  // Brand
  const brand = await prisma.brand.create({
    data: {
      userId: user.id,
      name: 'Golden Horn Jewellery',
      url: 'https://goldenhornjewellery.com',
      logo: { primary: 'https://logo.clearbit.com/goldenhornjewellery.com', variants: [] },
      colors: {
        primary: '#C8A96E',
        secondary: '#1C1B1B',
        accent: '#E6D3C1',
        background: '#0F0E0E',
        text: '#F5F0EB',
        palette: ['#C8A96E', '#1C1B1B', '#E6D3C1', '#0F0E0E', '#F5F0EB'],
      },
      typography: { heading: 'Playfair Display', body: 'Inter', accent: 'Great Vibes' },
      voice: {
        tone: ['Elegant', 'Warm', 'Sophisticated'],
        personality: ['Authentic', 'Refined', 'Passionate'],
        keywords: ['heritage', 'craftsmanship', 'elegance'],
        sampleTexts: [
          'Discover the essence of timeless elegance.',
          'Where heritage meets modern sophistication.',
        ],
      },
      values: ['Craftsmanship', 'Heritage', 'Quality'],
      aesthetic: ['modern heritage', 'elegant classic'],
      industry: 'jewelry',
      targetAudience: 'Modern consumers aged 25-45 seeking craftsmanship and heritage',
      summary:
        'Golden Horn Jewellery embodies modern heritage in the jewelry space. With a focus on craftsmanship, heritage, quality, the brand speaks to authentic, refined, passionate individuals.',
      images: {
        scraped: [
          'https://picsum.photos/seed/gh1/800/600',
          'https://picsum.photos/seed/gh2/800/600',
          'https://picsum.photos/seed/gh3/800/600',
        ],
        uploaded: [],
        products: [],
      },
      socialProfiles: { instagram: '@goldenhornjewellery', facebook: 'goldenhornjewellery' },
    },
  })

  // Second brand
  const brand2 = await prisma.brand.create({
    data: {
      userId: user.id,
      name: 'Botanica Skincare',
      url: 'https://botanicaskincare.com',
      logo: { primary: 'https://logo.clearbit.com/botanicaskincare.com', variants: [] },
      colors: {
        primary: '#5B8C5A',
        secondary: '#F7F3E9',
        accent: '#D4A574',
        background: '#FEFDFB',
        text: '#2D2D2D',
        palette: ['#5B8C5A', '#F7F3E9', '#D4A574', '#FEFDFB', '#2D2D2D'],
      },
      typography: { heading: 'Lora', body: 'DM Sans' },
      voice: {
        tone: ['Mindful', 'Warm', 'Trustworthy'],
        personality: ['Genuine', 'Caring', 'Thoughtful'],
        keywords: ['natural', 'botanical', 'sustainable'],
        sampleTexts: ['Nature-inspired skincare for radiant skin.'],
      },
      values: ['Sustainability', 'Transparency', 'Quality'],
      aesthetic: ['organic natural', 'clean scandinavian'],
      industry: 'beauty & cosmetics',
      targetAudience: 'Health-conscious women aged 25-40 seeking natural skincare',
      summary: 'Botanica Skincare brings organic natural beauty to the cosmetics space.',
      images: { scraped: [], uploaded: [], products: [] },
      socialProfiles: { instagram: '@botanicaskincare' },
    },
  })

  // Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      name: "Mother's Day - Honor Her Story",
      description: 'Celebrating maternal love with our heritage collection',
      objective: 'SEASONAL',
      status: 'PUBLISHED',
      platforms: ['instagram', 'facebook', 'pinterest'],
      concept: {
        name: 'Heritage & Elegance',
        description: 'Celebrate timeless beauty',
        emotion: 'Nostalgic Pride',
      },
      creditsCost: 45,
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      name: 'Spring Collection Launch',
      description: 'New spring jewelry line',
      objective: 'PRODUCT_LAUNCH',
      status: 'REVIEW',
      platforms: ['instagram', 'facebook', 'tiktok'],
      concept: {
        name: 'Spring Awakening',
        description: 'Fresh, vibrant, renewed',
        emotion: 'Joy & Renewal',
      },
      creditsCost: 60,
    },
  })

  const campaign3 = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      name: 'Heritage Collection Awareness',
      description: 'Brand awareness for the heritage line',
      objective: 'AWARENESS',
      status: 'PUBLISHED',
      platforms: ['instagram', 'facebook'],
      concept: {
        name: 'Ancient Craft',
        description: 'Traditional meets modern',
        emotion: 'Pride & Wonder',
      },
      creditsCost: 30,
    },
  })

  // Creatives for campaign 1
  const creativeFormats = [
    { platform: 'instagram', format: 'story', w: 1080, h: 1920 },
    { platform: 'instagram', format: 'feed', w: 1080, h: 1080 },
    { platform: 'facebook', format: 'feed', w: 1200, h: 630 },
    { platform: 'facebook', format: 'story', w: 1080, h: 1920 },
    { platform: 'pinterest', format: 'pin', w: 1000, h: 1500 },
  ]

  const creatives1 = await Promise.all(
    creativeFormats.map((f, i) =>
      prisma.creative.create({
        data: {
          campaignId: campaign1.id,
          brandId: brand.id,
          platform: f.platform,
          format: f.format,
          width: f.w,
          height: f.h,
          imageUrl: `https://placehold.co/${f.w}x${f.h}/1c1b1b/c8a96e?text=${f.platform}+${f.format}`,
          imagePrompt: `Elegant jewelry photography for ${f.platform} ${f.format}`,
          header: {
            text: 'HONOR HER STORY',
            font: 'Playfair Display',
            size: 48,
            color: '#ffffff',
            position: { x: 50, y: 200 },
            visible: true,
          },
          cta: { text: 'Shop Now', style: 'primary', url: 'https://goldenhornjewellery.com', visible: true },
          overlay: { color: '#000000', opacity: 0.4 },
          publishStatus: 'PUBLISHED',
          publishedAt: new Date('2026-02-25'),
          performanceScore: 70 + Math.floor(Math.random() * 25),
        },
      })
    )
  )

  // Creatives for campaign 2
  const creatives2 = await Promise.all(
    ['instagram', 'facebook', 'tiktok'].flatMap((platform) =>
      ['story', 'feed'].map((format) =>
        prisma.creative.create({
          data: {
            campaignId: campaign2.id,
            brandId: brand.id,
            platform,
            format,
            width: 1080,
            height: format === 'story' ? 1920 : 1080,
            imageUrl: `https://placehold.co/1080x${format === 'story' ? 1920 : 1080}/1c1b1b/c8a96e?text=Spring+${platform}`,
            imagePrompt: `Spring collection ${platform} ${format}`,
            publishStatus: 'DRAFT',
            performanceScore: null,
          },
        })
      )
    )
  )

  // Performance data for campaign 1 creatives
  const now = new Date()
  for (const creative of creatives1) {
    // Create 30 days of performance snapshots
    for (let day = 0; day < 30; day++) {
      const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000)
      const baseReach = 100 + Math.floor(Math.random() * 200)
      const baseLikes = Math.floor(baseReach * (0.05 + Math.random() * 0.1))
      await prisma.creativePerformance.create({
        data: {
          creativeId: creative.id,
          recordedAt: date,
          reach: baseReach,
          impressions: Math.floor(baseReach * 1.4),
          likes: baseLikes,
          comments: Math.floor(baseLikes * 0.1),
          shares: Math.floor(baseLikes * 0.05),
          saves: Math.floor(baseLikes * 0.15),
          clicks: Math.floor(baseReach * (0.03 + Math.random() * 0.04)),
          engagementRate: parseFloat((5 + Math.random() * 5).toFixed(1)),
          ctr: parseFloat((2 + Math.random() * 4).toFixed(1)),
        },
      })
    }
  }

  // Social accounts
  await prisma.socialAccount.create({
    data: {
      brandId: brand.id,
      platform: 'instagram',
      accountId: 'ig-goldenhorn-123',
      accountName: '@goldenhornjewellery',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GH',
      accessToken: 'mock-token-instagram',
      refreshToken: 'mock-refresh-instagram',
      tokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.socialAccount.create({
    data: {
      brandId: brand.id,
      platform: 'facebook',
      accountId: 'fb-goldenhorn-456',
      accountName: 'Golden Horn Jewellery',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GH',
      accessToken: 'mock-token-facebook',
      refreshToken: 'mock-refresh-facebook',
      tokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // Autopilot rules
  await prisma.autopilotRule.create({
    data: {
      brandId: brand.id,
      name: 'Low CTR Auto-Pause',
      isActive: true,
      conditions: [
        { metric: 'ctr', operator: 'lt', value: 1.0, timeWindow: '24h' },
      ],
      conditionLogic: 'AND',
      actions: [
        { type: 'pause', config: {} },
        { type: 'notify', config: { notifyChannels: ['email'] } },
      ],
      maxActionsPerDay: 3,
      cooldownMinutes: 360,
    },
  })

  await prisma.autopilotRule.create({
    data: {
      brandId: brand.id,
      name: 'High Performance Boost',
      isActive: true,
      conditions: [
        { metric: 'engagementRate', operator: 'gt', value: 10.0, timeWindow: '12h' },
      ],
      conditionLogic: 'AND',
      actions: [
        { type: 'boost', config: { boostMultiplier: 1.5 } },
      ],
      maxActionsPerDay: 5,
      cooldownMinutes: 180,
    },
  })

  // Photoshoot
  const photoshoot = await prisma.photoshoot.create({
    data: {
      brandId: brand.id,
      name: 'Spring Necklace Photoshoot',
      productImageUrl: 'https://picsum.photos/seed/necklace/800/800',
      productImageNoBackground: 'https://picsum.photos/seed/necklace-nobg/800/800',
      status: 'COMPLETED',
      creditCost: 12,
      completedAt: new Date(),
      variants: {
        create: [
          {
            template: 'Minimalist Studio',
            imageUrl: 'https://picsum.photos/seed/ps-min/1080/1080',
            prompt: 'Minimalist studio product shot with soft lighting',
            selected: true,
          },
          {
            template: 'Lifestyle Scene',
            imageUrl: 'https://picsum.photos/seed/ps-life/1080/1080',
            prompt: 'Lifestyle scene with model wearing necklace',
            selected: false,
          },
          {
            template: 'Luxury',
            imageUrl: 'https://picsum.photos/seed/ps-lux/1080/1080',
            prompt: 'Luxury setting with velvet and gold accents',
            selected: true,
          },
          {
            template: 'Nature/Outdoor',
            imageUrl: 'https://picsum.photos/seed/ps-nat/1080/1080',
            prompt: 'Natural outdoor setting with golden hour lighting',
            selected: false,
          },
        ],
      },
    },
  })

  // Update selected variant IDs
  const selectedVariants = await prisma.photoshootVariant.findMany({
    where: { photoshootId: photoshoot.id, selected: true },
  })
  await prisma.photoshoot.update({
    where: { id: photoshoot.id },
    data: { selectedVariantIds: selectedVariants.map((v) => v.id) },
  })

  // Agency
  const agency = await prisma.agency.create({
    data: {
      ownerId: user.id,
      name: 'Coff Creative Agency',
      plan: 'pro',
      members: {
        create: [
          {
            userId: user.id,
            role: 'OWNER',
            brandAccess: [],
            acceptedAt: new Date(),
          },
        ],
      },
    },
  })

  // Link brand to agency
  await prisma.brand.update({
    where: { id: brand.id },
    data: { agencyId: agency.id },
  })

  console.log('Seed complete!')
  console.log(`  User: ${user.email}`)
  console.log(`  Brands: ${brand.name}, ${brand2.name}`)
  console.log(`  Campaigns: ${campaign1.name}, ${campaign2.name}, ${campaign3.name}`)
  console.log(`  Creatives: ${creatives1.length + creatives2.length}`)
  console.log(`  Performance records: ${creatives1.length * 30}`)
  console.log(`  Photoshoot: ${photoshoot.name}`)
  console.log(`  Agency: ${agency.name}`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
