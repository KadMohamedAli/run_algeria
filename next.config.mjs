/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"export",
    images: {
        unoptimized: true, // 🚀 disables server-side image optimization
    },
};

export default nextConfig;
