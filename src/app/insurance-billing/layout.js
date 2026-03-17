import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Insurance & Billing | C.L.A.P.S. MD",
  description:
    "Accepted insurance carriers, payment policy highlights, and billing education for CLAPS MD in Wayne, NJ.",
  path: "/insurance-billing",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function InsuranceBillingLayout({ children }) {
  return children;
}
