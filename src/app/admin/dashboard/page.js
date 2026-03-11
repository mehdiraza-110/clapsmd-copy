import { buildPageMetadata } from "@/lib/seoMetadata";
import DashboardClient from "./DashboardClient";

export const metadata = buildPageMetadata({
  title: "Admin Dashboard | C.L.A.P.S. MD",
  description:
    "Admin dashboard overview for CLAPS MD operations in Wayne, NJ and Northern New Jersey.",
  path: "/admin/dashboard",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
