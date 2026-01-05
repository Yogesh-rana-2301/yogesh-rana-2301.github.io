/** @type {import('next').NextConfig} */
// Set this to true if deploying to a GitHub Pages PROJECT site (username.github.io/repo-name)
// Set to false if deploying to a GitHub Pages USER site (username.github.io)
const isProjectSite = true;
const repoName = "Portfolio-Yogesh_Rana";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages && isProjectSite ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
