/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@octokit/core"],
  },
};

module.exports = nextConfig;
