/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from
    // the Cloud Workstations editor.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
};

export default nextConfig;
