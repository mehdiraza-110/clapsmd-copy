import { buildPageMetadata } from "@/lib/seoMetadata";
import ServicesCrudClient from "./ServicesCrudClient";

export const metadata = buildPageMetadata({
  title: "Admin Services | C.L.A.P.S. MD",
  description:
    "Manage service records in the CLAPS MD admin panel with create, update, and delete actions.",
  path: "/admin/services",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminServicesPage() {
  return <ServicesCrudClient />;
}
