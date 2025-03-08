import { LoadingIndicator } from '@/components/loading-indicator'

import { RefreshPage } from './refresh'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params

  return (
    <>
      <section>
        <h3>Refreshing wellness session...</h3>
      </section>

      <section>
        <LoadingIndicator />
      </section>

      <RefreshPage twitterUsername={twitterUsername} />
    </>
  )
}
