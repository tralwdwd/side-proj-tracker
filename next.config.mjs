/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["sequelize", "pg", "fs"]
};

export default nextConfig;
