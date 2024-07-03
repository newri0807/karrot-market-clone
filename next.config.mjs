/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
    images: {
        remotePatterns: [
            {
                hostname: "firebasestorage.googleapis.com",
            },
        ],
    },
    // async redirects() {
    //     return [
    //         {
    //             source: "/products/add",
    //             destination: "/product/add-product",
    //             permanent: true,
    //         },
    //     ];
    // },
};

export default nextConfig;
