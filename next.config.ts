/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kmcccsvgdmmnituxxaej.supabase.co', // 你的 Supabase 域名
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 之前 About 页面用的图库
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // 之前用的占位图
      }
    ],
  },
};

export default nextConfig;