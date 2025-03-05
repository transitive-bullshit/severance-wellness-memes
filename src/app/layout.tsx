import './globals.css'

import type { Metadata } from 'next'
import cs from 'clsx'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { AudioProvider } from '@/components/audio-provider'
import { Bootstrap } from '@/components/bootstrap'
import { ThemeProvider } from '@/components/theme-provider'
import * as config from '@/lib/config'

import { Footer } from './footer'
import { Header } from './header'
import { PostHogProvider } from './providers'
import styles from './styles.module.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: config.title,
  description: config.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <AudioProvider>
            <PostHogProvider>
              <div className={styles.root}>
                <Header />

                <main className={cs(styles.main, 'py-12')}>{children}</main>

                <Toaster richColors />
                <Footer />
              </div>
            </PostHogProvider>
          </AudioProvider>
        </ThemeProvider>

        <Bootstrap />
      </body>
    </html>
  )
}
