'use client'

import { useSearchParams } from 'next/navigation'
import { useEffectOnce } from 'react-use'
import { toast } from 'sonner'

export function CheckoutHandler({ status }: { status: string }) {
  const searchParams = useSearchParams()
  const checkout = searchParams.get('checkout')

  useEffectOnce(() => {
    if (
      checkout === 'success' &&
      (status === 'pending' || status === 'resolved')
    ) {
      if ((toast.getHistory().at(-1) as any)?.title !== 'Checkout successful') {
        toast.success('Checkout successful')
      }
    } else if (checkout === 'cancelled' && status === 'initial') {
      if ((toast.getHistory().at(-1) as any)?.title !== 'Checkout cancelled') {
        toast.info('Checkout cancelled')
      }
    }
  })

  return null
}
