import { RefreshPage } from './refresh'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params

  return <RefreshPage twitterUsername={twitterUsername} />
}
