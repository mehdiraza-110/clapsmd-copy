import { buildPageMetadata } from "@/lib/seoMetadata";
import DocumentsClient from "./DocumentsClient";

export const metadata = buildPageMetadata({
  title: "Admin Documents | C.L.A.P.S. MD",
  description:
    "Manage patient-facing document records in the CLAPS MD admin panel with upload, update, visibility, and delete actions.",
  path: "/admin/documents",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminDocumentsPage() {
  return <DocumentsClient />;
}
