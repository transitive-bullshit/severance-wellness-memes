// import { Skeleton } from '@/components/ui/skeleton'

import { LoadingIndicator } from '@/components'

import styles from './styles.module.css'

export default async function Page() {
  // TODO
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>Loading...</h1>
      </section>

      <section className={styles.wellnessFacts}>
        {/* <Skeleton className={styles.loadingWellnessFact} /> */}
        <LoadingIndicator isLoading={true} />
      </section>
    </div>
  )
}
