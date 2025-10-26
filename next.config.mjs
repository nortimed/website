// Force Vercel to include next-i18next.config.js in the output bundle
import "./next-i18next.config.js";
import i18nextConfig from "./next-i18next.config.js";

const config = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nortimed.com",
      },
    ],
  },
  webpack: (config) => {
    // Custom webpack configurations can be added here
    return config;
  },
  ...i18nextConfig,
};

export default config;
