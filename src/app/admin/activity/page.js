import { buildPageMetadata } from "@/lib/seoMetadata";
import ActivityClient from "./ActivityClient";

export const metadata = buildPageMetadata({
  title: "Admin Recent Activity | C.L.A.P.S. MD",
  description:
    "Review recent administrator actions across blogs, notices, and services in the CLAPS MD admin panel.",
  path: "/admin/activity",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminActivityPage() {
  return <ActivityClient />;
}
