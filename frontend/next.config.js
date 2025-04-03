const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "http", hostname: "img1.kakaocdn.net" },
      { protocol: "http", hostname: "t1.kakaocdn.net" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "sitem.ssgcdn.com" },
      { protocol: "https", hostname: "static.megamart.com" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "p.kakaocdn.net" },
      { protocol: "https", hostname: "example.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
