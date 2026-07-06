import { buildPageMetadata } from "@/lib/seoMetadata";
import VideoManagementClient from "./VideoManagementClient";

export const metadata = buildPageMetadata({
  title: "Admin Homepage Video | C.L.A.P.S. MD",
  description:
    "Manage the video shown on the homepage from the CLAPS MD admin panel.",
  path: "/admin/video",
  ogImage: "/images/clapsmd-logo-high-res.jpg",
});

export default function AdminVideoPage() {
  return <VideoManagementClient />;
}
