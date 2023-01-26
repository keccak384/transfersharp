/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/send',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
