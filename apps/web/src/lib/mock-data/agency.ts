import { AgencyRole } from '@repo/types'
import type { AgencyPlan, AgencyMember, AgencyBrand, AgencyBillingEntry, TeamActivity } from '@repo/types'

export const mockAgencyMembers: AgencyMember[] = [
  { id: 'member-1', name: 'Asım Varol', email: 'asim@coff.ai', avatarUrl: null, role: AgencyRole.OWNER, brandAccess: [], lastActiveAt: new Date('2026-03-01T18:00:00Z'), invitedAt: new Date('2026-01-01'), acceptedAt: new Date('2026-01-01') },
  { id: 'member-2', name: 'Elif Demir', email: 'elif@coff.ai', avatarUrl: null, role: AgencyRole.ADMIN, brandAccess: [], lastActiveAt: new Date('2026-03-01T16:30:00Z'), invitedAt: new Date('2026-01-15'), acceptedAt: new Date('2026-01-15') },
  { id: 'member-3', name: 'Can Yılmaz', email: 'can@agency.com', avatarUrl: null, role: AgencyRole.EDITOR, brandAccess: ['brand-1', 'brand-3'], lastActiveAt: new Date('2026-02-28T10:00:00Z'), invitedAt: new Date('2026-02-01'), acceptedAt: new Date('2026-02-02') },
  { id: 'member-4', name: 'Sara Johnson', email: 'sara@agency.com', avatarUrl: null, role: AgencyRole.EDITOR, brandAccess: ['brand-2', 'brand-4'], lastActiveAt: new Date('2026-02-27T14:00:00Z'), invitedAt: new Date('2026-02-10'), acceptedAt: new Date('2026-02-11') },
]

export const mockAgencyBrands: AgencyBrand[] = [
  { id: 'brand-1', name: 'Golden Horn Jewellery', logoUrl: 'https://placehold.co/80x80/1c1b1b/c5a55a?text=GH', industry: 'Jewellery', campaignCount: 12, creativeCount: 48, creditsUsed: 420, avgPerformance: 78, lastActivity: new Date('2026-03-01T15:00:00Z') },
  { id: 'brand-2', name: 'Urban Fitness Co', logoUrl: 'https://placehold.co/80x80/000000/00ff00?text=UF', industry: 'Fitness', campaignCount: 8, creativeCount: 32, creditsUsed: 280, avgPerformance: 72, lastActivity: new Date('2026-02-28T11:00:00Z') },
  { id: 'brand-3', name: 'Bella Organics', logoUrl: 'https://placehold.co/80x80/2d5a27/ffffff?text=BO', industry: 'Beauty', campaignCount: 6, creativeCount: 24, creditsUsed: 190, avgPerformance: 81, lastActivity: new Date('2026-02-27T09:00:00Z') },
  { id: 'brand-4', name: 'TechNova Solutions', logoUrl: 'https://placehold.co/80x80/1a1a2e/6c63ff?text=TN', industry: 'Technology', campaignCount: 4, creativeCount: 16, creditsUsed: 140, avgPerformance: 65, lastActivity: new Date('2026-02-26T14:00:00Z') },
  { id: 'brand-5', name: 'Cafe Istanbul', logoUrl: 'https://placehold.co/80x80/3e2723/d4a373?text=CI', industry: 'Food & Beverage', campaignCount: 3, creativeCount: 12, creditsUsed: 95, avgPerformance: 70, lastActivity: new Date('2026-02-25T10:00:00Z') },
]

export const mockBillingEntries: AgencyBillingEntry[] = [
  { id: 'bill-1', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', action: 'Campaign creation (8 creatives)', credits: 29, date: new Date('2026-03-01T10:00:00Z'), userId: 'member-1', userName: 'Asım Varol' },
  { id: 'bill-2', brandId: 'brand-2', brandName: 'Urban Fitness Co', action: 'Photoshoot (4 variants)', credits: 10, date: new Date('2026-02-28T14:00:00Z'), userId: 'member-4', userName: 'Sara Johnson' },
  { id: 'bill-3', brandId: 'brand-3', brandName: 'Bella Organics', action: 'Brand DNA creation', credits: 20, date: new Date('2026-02-27T09:00:00Z'), userId: 'member-3', userName: 'Can Yılmaz' },
  { id: 'bill-4', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', action: 'Publish (3 posts)', credits: 3, date: new Date('2026-02-26T16:00:00Z'), userId: 'member-2', userName: 'Elif Demir' },
  { id: 'bill-5', brandId: 'brand-4', brandName: 'TechNova Solutions', action: 'Campaign creation (4 creatives)', credits: 17, date: new Date('2026-02-25T11:00:00Z'), userId: 'member-4', userName: 'Sara Johnson' },
  { id: 'bill-6', brandId: 'brand-2', brandName: 'Urban Fitness Co', action: 'Autopilot replace', credits: 4, date: new Date('2026-02-24T08:00:00Z'), userId: 'member-1', userName: 'Asım Varol' },
  { id: 'bill-7', brandId: 'brand-5', brandName: 'Cafe Istanbul', action: 'Brand DNA creation', credits: 20, date: new Date('2026-02-23T10:00:00Z'), userId: 'member-1', userName: 'Asım Varol' },
  { id: 'bill-8', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', action: 'AI Insight generation', credits: 2, date: new Date('2026-02-22T15:00:00Z'), userId: 'member-2', userName: 'Elif Demir' },
]

export const mockTeamActivities: TeamActivity[] = [
  { id: 'act-1', userId: 'member-1', userName: 'Asım Varol', userAvatar: null, action: 'Created campaign', target: "Mother's Day Collection", brandId: 'brand-1', brandName: 'Golden Horn Jewellery', createdAt: new Date('2026-03-01T15:00:00Z') },
  { id: 'act-2', userId: 'member-2', userName: 'Elif Demir', userAvatar: null, action: 'Published 3 creatives', target: 'Spring 2026', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', createdAt: new Date('2026-03-01T14:30:00Z') },
  { id: 'act-3', userId: 'member-4', userName: 'Sara Johnson', userAvatar: null, action: 'Generated photoshoot', target: 'Protein Powder', brandId: 'brand-2', brandName: 'Urban Fitness Co', createdAt: new Date('2026-02-28T11:00:00Z') },
  { id: 'act-4', userId: 'member-3', userName: 'Can Yılmaz', userAvatar: null, action: 'Created Brand DNA', target: 'Bella Organics', brandId: 'brand-3', brandName: 'Bella Organics', createdAt: new Date('2026-02-27T09:00:00Z') },
  { id: 'act-5', userId: 'member-1', userName: 'Asım Varol', userAvatar: null, action: 'Updated autopilot rules', target: 'Low Performance Rule', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', createdAt: new Date('2026-02-26T16:00:00Z') },
  { id: 'act-6', userId: 'member-4', userName: 'Sara Johnson', userAvatar: null, action: 'Created campaign', target: 'Weekly Engagement', brandId: 'brand-2', brandName: 'Urban Fitness Co', createdAt: new Date('2026-02-25T14:00:00Z') },
  { id: 'act-7', userId: 'member-2', userName: 'Elif Demir', userAvatar: null, action: 'Downloaded brand kit', target: 'Golden Horn Jewellery', brandId: 'brand-1', brandName: 'Golden Horn Jewellery', createdAt: new Date('2026-02-24T10:00:00Z') },
  { id: 'act-8', userId: 'member-3', userName: 'Can Yılmaz', userAvatar: null, action: 'Scheduled 5 posts', target: 'Bella Spring Campaign', brandId: 'brand-3', brandName: 'Bella Organics', createdAt: new Date('2026-02-23T11:00:00Z') },
]

export const mockAgency = {
  id: 'agency-1',
  name: 'Coff Creative Agency',
  plan: 'PRO' as AgencyPlan,
  members: mockAgencyMembers,
  brands: mockAgencyBrands,
  totalCreditsUsed: 1125,
  totalCreditsRemaining: 3875,
  monthlySpend: 99,
  createdAt: new Date('2026-01-01'),
}
