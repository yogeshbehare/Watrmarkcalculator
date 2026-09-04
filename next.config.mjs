/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["sharp", "@napi-rs/canvas", "pdfjs-dist"]
  }
};

export default nextConfig;
