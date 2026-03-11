import { getSiteUrl } from "@/lib/siteUrl";

const SITE_NAME = "C.L.A.P.S. MD";
const DEFAULT_OG_IMAGE = "/images/clapsmd-logo-high-res.jpg";

function toAbsoluteUrl(pathOrUrl) {
  const siteUrl = getSiteUrl();
  if (typeof pathOrUrl !== "string" || pathOrUrl.length === 0) {
    return siteUrl;
  }
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith("/")) {
    return `${siteUrl}${pathOrUrl}`;
  }
  return `${siteUrl}/${pathOrUrl}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  ogImage = DEFAULT_OG_IMAGE,
}) {
  const canonical = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(ogImage);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
  };
}

export function getAbsoluteUrl(pathOrUrl) {
  return toAbsoluteUrl(pathOrUrl);
}
