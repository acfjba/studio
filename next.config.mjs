/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This allows the Next.js dev server to accept requests from your cloud workstation.
    // The port is hardcoded to 6000, which is the default for Firebase Studio.
    allowedDevOrigins: [
        '*.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
