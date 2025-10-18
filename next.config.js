/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable standalone output for optimized deployment
  output: 'standalone',

  // Compress responses
  compress: true,

  // Environment variables available to the browser
  env: {
    PYTHON_BACKEND_URL: process.env.PYTHON_BACKEND_URL,
  },

  // Optimize production builds
  poweredByHeader: false,

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
