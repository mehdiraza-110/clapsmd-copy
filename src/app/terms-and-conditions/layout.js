import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Terms & Conditions | C.L.A.P.S. MD",
  description:
    "Terms and Conditions for using the CLAPS MD website and accessing pulmonary function testing information.",
  path: "/terms-and-conditions",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function TermsAndConditionsLayout({ children }) {
  return children;
}
