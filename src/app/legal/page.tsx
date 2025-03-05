/* eslint-disable react/no-unescaped-entities */
import * as React from 'react'

import { Markdown } from '@/components/markdown'

import styles from './styles.module.css'

export default async function Page() {
  return (
    <>
      <section className={styles.page}>
        <div className={styles.meta}>
          <h1 className={styles.title}>Legal</h1>
        </div>

        <Markdown className={styles.markdown}>
          <p>TODO</p>
        </Markdown>
      </section>
    </>
  )
}
