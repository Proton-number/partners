/** @type {import('next').NextConfig} */

const nextConfig = {
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
};

module.exports = nextConfig;
