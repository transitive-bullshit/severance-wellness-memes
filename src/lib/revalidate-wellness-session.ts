'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}) {
  if (!twitterUsername) return
  revalidateTag(`wellness-session-${twitterUsername}`)
  revalidatePath(`/x/${twitterUsername}`)
}
