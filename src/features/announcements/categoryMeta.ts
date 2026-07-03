import type { ComponentProps } from 'react'
import type { AnnouncementCategory } from '../../types'
import type { Badge } from '../../components/ui'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

/** Each category maps to one of the allowed desaturated badge tints (no new hues). */
export const CATEGORY_META: Record<
  AnnouncementCategory,
  { label: string; variant: BadgeVariant }
> = {
  general: { label: 'General', variant: 'neutral' },
  policy: { label: 'Policy', variant: 'warning' },
  event: { label: 'Event', variant: 'accent' },
  people: { label: 'People', variant: 'success' },
  facilities: { label: 'Facilities', variant: 'danger' },
}
