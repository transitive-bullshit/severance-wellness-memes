import { LoadingIndicator } from '@/components/loading-indicator'

import styles from './styles.module.css'

export default async function Page() {
  // TODO
  return (
    <>
      <section className={styles.intro}>
        <h1 className={styles.title}>Loading...</h1>
      </section>

      <section className='flex-auto justify-center'>
        <LoadingIndicator isLoading={true} />
      </section>
    </>
  )
}
