import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // loader: 'custom',
    // loaderFile: 'loader.js',
    localPatterns: [
      {
        pathname: '/o/**'
      }
    ],
    remotePatterns: [
      {
        hostname: 'pbs.twimg.com'
      }
    ]
  }
}

export default nextConfig
