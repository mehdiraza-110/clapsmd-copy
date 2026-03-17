import { blogPosts } from "@/lib/blogPosts";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toDate(value) {
  if (!value) {
    return new Date();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function sitemap() {
  const baseUrl = getSiteUrl();
  const routes = [
    "",
    "/about",
    "/asthma",
    "/pft-lab",
    "/blog",
    "/insurance-billing",
    "/policies",
    "/self-pay-pricing",
  ];
  const now = new Date();

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: toDate(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
