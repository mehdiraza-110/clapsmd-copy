import { buildPageMetadata } from "@/lib/seoMetadata";
import BlogsClient from "./BlogsClient";

export const metadata = buildPageMetadata({
  title: "Admin Blogs | C.L.A.P.S. MD",
  description:
    "Manage blog posts in the CLAPS MD admin panel for Wayne, NJ and Northern New Jersey.",
  path: "/admin/blogs",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminBlogsPage() {
  return <BlogsClient />;
}
