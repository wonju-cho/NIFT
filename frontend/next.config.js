/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      dangerouslyAllowSVG: true, // SVG 허용
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
  };
  
  module.exports = nextConfig;
  