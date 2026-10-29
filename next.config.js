/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    agentFeedback: true,
  },
  images: {
    qualities: [70, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzvyjnmmwwbuhyeocyia.supabase.co",
        pathname: "/storage/v1/object/public/property-images/**",
      },
    ],
  },

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
