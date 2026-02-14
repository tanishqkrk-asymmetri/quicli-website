/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r.mobirisesite.com"
      },
      {
        protocol: "https",
        hostname: "e.mobirise.com"
      }
    ]
  }
};

export default nextConfig;

