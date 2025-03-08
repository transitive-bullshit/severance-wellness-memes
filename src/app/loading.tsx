import { LoadingIndicator } from '@/components/loading-indicator'

import styles from './styles.module.css'

export default async function Page() {
  return (
    <>
      <section className={styles.intro}>
        <h3 className={styles.title}>Loading...</h3>
      </section>

      <section>
        <LoadingIndicator />
      </section>
    </>
  )
}
