import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "PFT Lab | C.L.A.P.S. MD",
  description:
    "Pulmonary function testing for pediatric and adult patients in Wayne, NJ, including spirometry, lung volumes, DLCO, impulse oscillometry, and FeNO.",
  path: "/pft-lab",
  ogImage: "/images/hero-image.webp",
});

export default function PftLabLayout({ children }) {
  return children;
}
