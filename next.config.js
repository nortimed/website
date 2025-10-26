import { i18n } from "./next-i18next.config";

export default {
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
  i18n,
  webpack: (config) => {
    // Custom webpack configurations can be added here
    return config;
  },
};
