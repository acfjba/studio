/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to be accessed from
    // the Cloud Workstation and other development environments.
    allowedDevOrigins: [
        "*.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev",
        "*.cloudworkstations.dev"
    ],
  },
};

export default nextConfig;
