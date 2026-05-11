import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Self Pay Pricing | C.L.A.P.S. MD",
  description:
    "Self-pay pricing and the downloadable Self-Pay Agreement for CLAPS MD patients in Wayne, NJ.",
  path: "/self-pay-pricing",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function SelfPayAgreementLayout({ children }) {
  return children;
}
