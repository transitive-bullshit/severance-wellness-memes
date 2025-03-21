'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateWellnessSession({
  twitterUsername
}: {
  twitterUsername: string
}) {
  if (!twitterUsername) return

  // TODO: These don't seem to always be taking effect...
  try {
    revalidateTag(`wellness-session-${twitterUsername}`)
    revalidatePath(`/x/${twitterUsername}`)
    revalidatePath(`/x/${twitterUsername}?checkout=success`)
  } catch {
    // Silently ignore errors if run outside of next.js context
  }
}
