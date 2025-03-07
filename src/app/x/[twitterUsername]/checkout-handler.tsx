'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function CheckoutHandler() {
  const searchParams = useSearchParams()
  const checkout = searchParams.get('checkout')

  useEffect(() => {
    if (checkout === 'success') {
      toast.success('Checkout successful')
    } else if (checkout === 'cancelled') {
      toast.info('Checkout cancelled')
    }
  }, [checkout])

  return null
}
