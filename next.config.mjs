/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clapsmd-storage.s3.ca-central-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // Increase timeout for static page generation (default is 60s)
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
