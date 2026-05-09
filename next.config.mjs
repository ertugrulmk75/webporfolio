/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  experimental: { taint: true },
  async headers() {
    return [
      {
        // Apply security headers to everything except /studio (Sanity Studio
        // uses iframes for live editing and needs broader policies).
        source: '/((?!studio).*)',
        headers: securityHeaders,
      },
    ];
  },
};
export default nextConfig;
