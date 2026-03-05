import { prisma } from '@repo/db'
import { getSocialClient } from './index'
import type { PublishResult } from './types'

export async function publishToSocial(scheduleId: string): Promise<PublishResult> {
  const schedule = await prisma.publishSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      account: true,
    },
  })

  if (!schedule) {
    return { success: false, error: 'Schedule not found' }
  }

  const client = getSocialClient(schedule.account.platform)
  if (!client) {
    await markFailed(scheduleId, `Unsupported platform: ${schedule.account.platform}`)
    return { success: false, error: `Unsupported platform: ${schedule.account.platform}` }
  }

  // Check token expiry and refresh if needed
  const account = schedule.account
  if (account.tokenExpiresAt && account.tokenExpiresAt < new Date() && account.refreshToken) {
    try {
      const tokens = await client.refreshAccessToken(account.refreshToken)
      await prisma.socialAccount.update({
        where: { id: account.id },
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || account.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
      })
      account.accessToken = tokens.accessToken
    } catch {
      await markFailed(scheduleId, 'Token expired and refresh failed')
      return { success: false, error: 'Token expired and refresh failed' }
    }
  }

  // Get creative image URL
  const creative = await prisma.creative.findFirst({
    where: { id: schedule.creativeId },
  })

  if (!creative) {
    await markFailed(scheduleId, 'Creative not found')
    return { success: false, error: 'Creative not found' }
  }

  // Mark as publishing
  await prisma.publishSchedule.update({
    where: { id: scheduleId },
    data: { status: 'PUBLISHING' },
  })

  // Publish
  const result = await client.publish(
    { accessToken: account.accessToken, refreshToken: account.refreshToken || undefined },
    {
      imageUrl: creative.imageUrl,
      caption: schedule.caption || '',
      hashtags: schedule.hashtags,
    }
  )

  if (result.success) {
    await prisma.$transaction([
      prisma.publishSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      }),
      prisma.creative.update({
        where: { id: creative.id },
        data: {
          publishStatus: 'PUBLISHED',
          publishedAt: new Date(),
          postUrl: result.postUrl,
          postId: result.postId,
        },
      }),
    ])
  } else {
    await markFailed(scheduleId, result.error || 'Publishing failed')
  }

  return result
}

async function markFailed(scheduleId: string, error: string): Promise<void> {
  await prisma.publishSchedule.update({
    where: { id: scheduleId },
    data: {
      status: 'FAILED',
      error,
      retryCount: { increment: 1 },
    },
  })
}

export async function fetchPostMetrics(creativeId: string): Promise<void> {
  const creative = await prisma.creative.findUnique({
    where: { id: creativeId },
    include: {
      campaign: {
        include: {
          brand: {
            include: { socialAccounts: true },
          },
        },
      },
    },
  })

  if (!creative?.postId || !creative.campaign?.brand) return

  const account = creative.campaign.brand.socialAccounts.find(
    (a) => a.platform === creative.platform && a.isActive
  )
  if (!account) return

  const client = getSocialClient(creative.platform)
  if (!client) return

  const metrics = await client.getMetrics(
    { accessToken: account.accessToken },
    creative.postId
  )

  if (metrics) {
    await prisma.creativePerformance.create({
      data: {
        creativeId,
        reach: metrics.reach || metrics.impressions || 0,
        impressions: metrics.impressions || metrics.reach || 0,
        likes: metrics.likes || metrics.reactions || 0,
        comments: metrics.comments || 0,
        shares: metrics.shares || metrics.retweet_count || 0,
        saves: metrics.saved || metrics.bookmark_count || 0,
        clicks: metrics.clicks || 0,
        videoViews: metrics.views || metrics.view_count || null,
        engagementRate: metrics.engagement ? (metrics.engagement / (metrics.reach || 1)) * 100 : null,
        ctr: metrics.clicks && metrics.impressions ? (metrics.clicks / metrics.impressions) * 100 : null,
      },
    })
  }
}
