import { buildPageMetadata } from "@/lib/seoMetadata";
import ClinicHoursClient from "./ClinicHoursClient";

export const metadata = buildPageMetadata({
  title: "Admin Clinic Hours | C.L.A.P.S. MD",
  description: "Set or update the clinic hours displayed on the C.L.A.P.S. MD website.",
  path: "/admin/clinic-hours",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminClinicHoursPage() {
  return <ClinicHoursClient />;
}
