const DEFAULT_SITE_URL = "https://clapsmd.org";

export function getSiteUrl() {
  const rawValue = process.env.NEXT_PUBLIC_SITE_URL;

  if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
    return DEFAULT_SITE_URL;
  }

  const normalized = rawValue.trim().replace(/\/+$/, "");

  try {
    const parsed = new URL(normalized);
    if (!parsed.protocol || !parsed.hostname) {
      return DEFAULT_SITE_URL;
    }
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}
