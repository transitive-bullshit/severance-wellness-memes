import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'pbs.twimg.com'
      },
      {
        hostname: 'severance-wellness-session.com'
      }
    ]
  }
}

export default nextConfig
