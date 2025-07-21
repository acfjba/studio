
import type {NextConfig} from 'next';
import {config} from 'dotenv';

// This line ensures that the .env file is loaded for the local development environment.
config({path: '.env'});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // We remove the hardcoded env block here.
  // Next.js will automatically pick up NEXT_PUBLIC_ variables from process.env
  // which is populated by the dotenv `config()` call above for local development.
};

export default nextConfig;
