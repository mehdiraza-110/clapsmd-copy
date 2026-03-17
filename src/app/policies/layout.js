import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Policies | C.L.A.P.S. MD",
  description:
    "Privacy, HIPAA, terms, accessibility, price transparency, and data use policies for CLAPS MD in Wayne, NJ.",
  path: "/policies",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function PoliciesLayout({ children }) {
  return children;
}
