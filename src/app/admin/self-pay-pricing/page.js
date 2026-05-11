import { buildPageMetadata } from "@/lib/seoMetadata";
import SelfPayPricingCrudClient from "./SelfPayPricingCrudClient";

export const metadata = buildPageMetadata({
  title: "Admin Self Pay Pricing | C.L.A.P.S. MD",
  description:
    "Manage self-pay pricing records in the CLAPS MD admin panel with create, update, and delete actions.",
  path: "/admin/self-pay-pricing",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminSelfPayPricingPage() {
  return <SelfPayPricingCrudClient />;
}
