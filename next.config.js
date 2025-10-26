const { i18n } = require("./next-i18next.config");
module.exports = {
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
