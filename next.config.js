/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  ...(isGithubPages ? { output: "export", basePath: "/starter-logo" } : {}),
};

module.exports = nextConfig;
