import './globals.css'

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'

import { Bootstrap } from '@/components/bootstrap'
import { ThemeProvider } from '@/components/theme-provider'
import * as config from '@/lib/config'

// import { Footer } from './footer'
import { Footer2 } from './footer2'
import { Header } from './header'
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
          <div className={styles.root}>
            <Header />

            <main className={styles.main}>{children}</main>

            <Footer2 />
          </div>
        </ThemeProvider>

        <Bootstrap />
        <Analytics />
      </body>
    </html>
  )
}
