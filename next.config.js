/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Allow file uploads up to 10MB in size.
    maxUploadSize: 10 * 1024 * 1024,
  },
  images: {
    domains: ['i.ibb.co'],
  },
}

module.exports = nextConfig;