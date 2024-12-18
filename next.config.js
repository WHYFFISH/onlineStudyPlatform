/** @type {import('next').NextConfig} */
const nextConfig = {
    httpAgentOptions: {
        keepAlive: true,
    },
    images: {
        domains: [
            `${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com`
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    webpack: (config, { dev, isServer }) => {
        if (dev) {
            config.cache = false
        }
        return config
    }
}

module.exports = nextConfig 