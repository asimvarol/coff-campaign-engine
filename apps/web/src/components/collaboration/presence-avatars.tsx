'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'

interface PresenceAvatarsProps {
  users: { userId: string; clientId: string }[]
  currentUserId: string
}

const COLORS = [
  'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500',
]

function getInitials(userId: string): string {
  return userId.slice(0, 2).toUpperCase()
}

function getColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0
  }
  return COLORS[Math.abs(hash) % COLORS.length]!
}

export function PresenceAvatars({ users, currentUserId }: PresenceAvatarsProps) {
  const otherUsers = users.filter((u) => u.userId !== currentUserId)

  if (otherUsers.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {otherUsers.slice(0, 5).map((user) => (
          <Tooltip key={user.clientId}>
            <TooltipTrigger asChild>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold text-white ${getColor(user.userId)}`}
              >
                {getInitials(user.userId)}
              </div>
            </TooltipTrigger>
            <TooltipContent>{user.userId}</TooltipContent>
          </Tooltip>
        ))}
        {otherUsers.length > 5 && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold">
            +{otherUsers.length - 5}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
