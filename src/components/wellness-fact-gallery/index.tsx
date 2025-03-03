import cs from 'clsx'

import type * as types from '@/lib'

import { WellnessFact } from '../wellness-fact'
import styles from './styles.module.css'

export function WellnessFactGallery({
  wellnessFacts,
  className
}: {
  wellnessFacts: types.WellnessFact[]
  className?: string
}) {
  return (
    <div className={cs(styles.wellnessFactGallery, className)}>
      {wellnessFacts.map((wellnessFact) => (
        <WellnessFact key={wellnessFact.id} wellnessFact={wellnessFact} />
      ))}
    </div>
  )
}
