'use client'

import cs from 'clsx'
import Image from 'next/image'

import type * as types from '@/lib/types'

import { ActiveLink } from './active-link'

export function UserAvatar({
  user,
  type = 'twitter',
  className,
  children,
  fill = false
}: {
  user?: Pick<
    types.SocialDataTwitterUser,
    'profile_image_url_https' | 'screen_name' | 'name'
  > | null
  type?: 'twitter' | 'profile'
  className?: string
  children?: React.ReactNode
  fill?: boolean
}) {
  if (!user?.profile_image_url_https) {
    return null
  }

  const linkProps =
    type === 'twitter'
      ? {
          href: `https://x.com/${user.screen_name}`,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      : {
          href: `/x/${user.screen_name}`
        }

  return (
    <ActiveLink
      {...linkProps}
      className={cs(
        children ? 'inline-flex flex-row items-center gap-3' : '',
        className
      )}
    >
      <Image
        alt={user.screen_name}
        src={user.profile_image_url_https.replace(
          '_normal.jpg',
          '_400x400.jpg'
        )}
        width={fill ? undefined : 400}
        height={fill ? undefined : 400}
        fill={fill}
        className='inline-block! size-10 rounded-full ring-2 md:ring-1 ring-accent-foreground'
      />

      {children}
    </ActiveLink>
  )
}
