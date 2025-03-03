'use client'

import type * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// import { createSignal, useSignal } from "react-alien-signals";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
