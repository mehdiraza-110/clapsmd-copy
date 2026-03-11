import { buildPageMetadata } from "@/lib/seoMetadata";
import BlogEditorForm from "./BlogEditorForm";

export const metadata = buildPageMetadata({
  title: "New Blog | Admin | C.L.A.P.S. MD",
  description:
    "Create a new blog with rich text content and featured image in the CLAPS MD admin panel.",
  path: "/admin/blogs/new",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function NewBlogPage() {
  return <BlogEditorForm />;
}
