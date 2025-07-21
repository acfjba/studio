import type {NextConfig} from 'next';
import {config} from 'dotenv';

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
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "YOUR_API_KEY",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "school-platform-kc9uh.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "school-platform-kc9uh",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "school-platform-kc9uh.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "96759132049",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:96759132049:web:3e6d8b94db433f7c17b738",
  }
};

export default nextConfig;
