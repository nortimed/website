const { i18n } = require("./next-i18next.config");
module.exports = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Replace with your image domains
  },
  i18n,
  webpack: (config) => {
    // Custom webpack configurations can be added here
    return config;
  },
};
