// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
         protocol: "https",
         hostname: "*.googleusercontent.com",
         port: "",
         pathname: "**",
      }
    ]
  },
  // ...any other existing configuration
};

export default nextConfig;
