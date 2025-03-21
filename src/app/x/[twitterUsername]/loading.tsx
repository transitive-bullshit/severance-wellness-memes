import { LoadingIndicator } from '@/components/loading-indicator'

export default async function Page() {
  return (
    <>
      <section>
        <h3>Loading wellness session...</h3>
      </section>

      <section>
        <LoadingIndicator />
      </section>
    </>
  )
}
