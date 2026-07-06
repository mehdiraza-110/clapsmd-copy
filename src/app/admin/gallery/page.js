import { buildPageMetadata } from "@/lib/seoMetadata";
import GalleryCrudClient from "./GalleryCrudClient";

export const metadata = buildPageMetadata({
  title: "Admin Gallery | C.L.A.P.S. MD",
  description:
    "Manage the images shown on the public website from the CLAPS MD admin panel.",
  path: "/admin/gallery",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminGalleryPage() {
  return <GalleryCrudClient />;
}
