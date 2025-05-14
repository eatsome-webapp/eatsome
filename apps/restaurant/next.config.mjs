/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/auth"],
  serverExternalPackages: [],
  experimental: {
    esmExternals: true
  }
};

export default nextConfig; 