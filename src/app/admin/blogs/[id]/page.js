import { buildPageMetadata } from "@/lib/seoMetadata";
import BlogEditorForm from "../new/BlogEditorForm";

export const metadata = buildPageMetadata({
  title: "Edit Blog | Admin | C.L.A.P.S. MD",
  description:
    "Edit blog content, SEO details, and status in the CLAPS MD admin panel.",
  path: "/admin/blogs",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function EditBlogPage({ params }) {
  return <BlogEditorForm blogId={params.id} />;
}
