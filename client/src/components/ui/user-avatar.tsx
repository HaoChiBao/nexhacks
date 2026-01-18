'use client'

import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  user: User | null
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url
  const initial = user.email?.charAt(0).toUpperCase() || 'U'

  if (avatarUrl) {
    return (
      <img
        alt="User avatar"
        className={cn("h-8 w-8 rounded-full border border-gray-700 object-cover", className)}
        src={avatarUrl}
      />
    )
  }

  return (
    <div
      className={cn(
        "h-8 w-8 rounded-full border border-gray-700 bg-emerald-700 flex items-center justify-center text-white text-xs font-bold select-none",
        className
      )}
    >
      {initial}
    </div>
  )
}
