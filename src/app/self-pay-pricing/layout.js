import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Self Pay Pricing | C.L.A.P.S. MD",
  description:
    "Self-pay pricing for office visits, telemedicine, and respiratory testing at CLAPS MD in Wayne, NJ.",
  path: "/self-pay-pricing",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function SelfPayPricingLayout({ children }) {
  return children;
}
