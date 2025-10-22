module.exports = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Replace with your image domains
  },
  webpack: (config) => {
    // Custom webpack configurations can be added here
    return config;
  },
};
