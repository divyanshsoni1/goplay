import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Google profile images and other OAuth provider images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Strict mode catches subtle bugs early
  reactStrictMode: true,

  // Silence the Next.js X-Powered-By header (redundant; proxy does this too)
  poweredByHeader: false,

  // Tell Turbopack/Next.js that this directory is the workspace root.
  // Without this, Next.js can get confused by lockfiles in parent directories
  // and log a spurious workspace-root warning that pollutes CI output.
  turbopack: {
    root: __dirname,
  },

  // Redirect /auth/error to our /(auth)/error page
  async redirects() {
    return [
      {
        source: "/auth/error",
        destination: "/error",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
