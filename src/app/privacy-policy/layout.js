import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy | C.L.A.P.S. MD",
  description:
    "Privacy Policy for CLAPS MD covering collection, use, storage, and protection of patient and website information.",
  path: "/privacy-policy",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
