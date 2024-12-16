/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
        bodyParser: {
            sizeLimit: '50mb'
        },
        responseLimit: '50mb'
    },
    images: {
        domains: [
            `${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com`
        ]
    }
}

module.exports = nextConfig 