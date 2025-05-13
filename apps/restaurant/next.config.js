/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Deze lijn voorkomt dat ESLint fouten de build laten mislukken
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 