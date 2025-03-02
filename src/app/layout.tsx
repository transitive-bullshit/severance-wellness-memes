import './globals.css'

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'

import { bootstrap } from '~/lib/bootstrap'
import * as config from '~/lib/config'

import { Footer } from './footer'
import { Header } from './header'
import styles from './styles.module.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

bootstrap()

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
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <div className={styles.root}>
          <Header />

          <main className={styles.main}>{children}</main>

          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  )
}
