import type { ReactNode } from 'react'
import cs from 'clsx'

import styles from './styles.module.css'

/**
 * `content` is assumed to have already been transformed into HTML via remark/rehype.
 */
export function Markdown({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cs('prose dark:prose-invert', styles.markdown, className)}>
      {children}
    </div>
  )
}
