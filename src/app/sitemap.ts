import { DATA } from "@/data/resume";
import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = DATA.url;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // /pics is intentionally excluded — personal gallery, not for indexing
  ];

  // Get all blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const contentDir = path.join(process.cwd(), "content");
    const files = fs.readdirSync(contentDir);

    blogPosts = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => ({
        url: `${baseUrl}/blog/${file.replace(".mdx", "")}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.log("No blog posts found or error reading content directory");
  }

  return [...staticPages, ...blogPosts];
}
