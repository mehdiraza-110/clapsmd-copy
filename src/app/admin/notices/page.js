import { buildPageMetadata } from "@/lib/seoMetadata";
import NoticesClient from "./NoticesClient";

export const metadata = buildPageMetadata({
  title: "Admin Announcements | C.L.A.P.S. MD",
  description:
    "Create, schedule, update, and manage announcements in the CLAPS MD admin panel.",
  path: "/admin/notices",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminNoticesPage() {
  return <NoticesClient />;
}
