import { LoadingIndicator } from '@/components/loading-indicator'

import styles from './styles.module.css'

export default async function Page() {
  // TODO
  return (
    <>
      <section className={styles.intro}>
        <h3 className={styles.title}>Loading...</h3>
      </section>

      <section className='flex-auto justify-center p-16'>
        <LoadingIndicator isLoading={true} />
      </section>
    </>
  )
}
