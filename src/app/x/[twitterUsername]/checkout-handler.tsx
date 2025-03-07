'use client'

import { useSearchParams } from 'next/navigation'
import { useEffectOnce } from 'react-use'
import { toast } from 'sonner'

export function CheckoutHandler() {
  const searchParams = useSearchParams()
  const checkout = searchParams.get('checkout')

  useEffectOnce(() => {
    if (checkout === 'success') {
      toast.success('Checkout successful')
    } else if (checkout === 'cancelled') {
      toast.info('Checkout cancelled')
    }
  })

  return null
}
