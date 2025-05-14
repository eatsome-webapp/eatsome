/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/auth"],
  experimental: {
    serverComponentsExternalPackages: [],
    esmExternals: 'loose',
  },
};

export default nextConfig; 