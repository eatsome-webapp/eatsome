/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ui", "auth"],
  
  // SWC compiler configuratie
  compiler: {
    // Ingebouwde componenten optimalisatie
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // Verwijder console.logs in productie
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
    // CSS-modules automatische naamgeving in development
    styledComponents: {
      displayName: process.env.NODE_ENV === 'development',
      ssr: true,
      fileName: false,
    },
  },
  
  // SWC Minificatie (standaard ingeschakeld in Next.js 13+)
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'xplxxwodtmlrqrifvlcj.supabase.co',
      'xplxxwodtmlrqrifvlcj.supabase.in',
      'xplxxwodtmlrqrifvlcj.supabase.co',
    ],
  },
  experimental: {
    // Optimaliseer CSS (werkt goed met SWC)
    optimizeCss: true,
    // Webpack 5 is standaard in Next.js 13+
    webpackBuildWorker: true,
    // Verbeterde module bundling met SWC
    modularizeImports: {
      'lucide-react': {
        transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        skipDefaultConversion: true,
      },
    },
  },
  // Enable server actions (moved out of experimental in newer Next.js versions)
  serverActions: {
    bodySizeLimit: '2mb',
  },
  // Enable server components
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'critters'],
  // Enable React DevTools in production
  reactProductionProfiling: true,
  // Configure webpack
  webpack: (config, { isServer, dev }) => {
    // Add support for .mjs files
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Only add these fallbacks for client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
      };
    }
    
    return config;
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mjs'],
  // Configure TypeScript
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  // Configure ESLint
  eslint: {
    // Enable ESLint during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
