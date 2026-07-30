import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bijou-cosmetics.s3.me-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bijou-sky-bucket.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "staging-front.bijou.ae",
      },
      {
        protocol: "https",
        hostname: "suya-cosmetics.s3.me-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);


