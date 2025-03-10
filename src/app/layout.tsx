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
import { PostHogProvider } from './posthog-provider'
import styles from './styles.module.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  authors: [{ name: config.author, url: config.twitterUrl }],
  metadataBase: new URL(config.prodUrl),
  keywords: [
    'severance',
    'memes',
    'severance memes',
    'twitter',
    'twitter roast',
    'twitter memes',
    'roast',
    'ai',
    'generative',
    'art',
    'lumon',
    'wellness',
    'wellness session',
    'meme generator',
    'severance wellness memes',
    'wellness memes',
    'meme maker',
    'meme creator',
    'severance meme maker'
  ],
  openGraph: {
    title: config.title,
    description: config.description,
    siteName: config.title,
    locale: 'en_US',
    type: 'website',
    url: config.prodUrl
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@transitive_bs',
    title: config.title,
    description: config.description
  }
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

                <main className={cs(styles.main, 'pt-8 pb-16 px-4 md:px-0')}>
                  {children}
                </main>

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
