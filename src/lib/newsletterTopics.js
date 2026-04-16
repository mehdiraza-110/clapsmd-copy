const NEWSLETTER_URL = "https://claps-newsletter.beehiiv.com/";
const NEWSLETTER_DATA_URL = "https://claps-newsletter.beehiiv.com/?_data=routes%2Findex";

const FALLBACK_TOPICS = [
  {
    title: "What a March Madness Scare Teaches Us About Athlete Breathing",
    description:
      "What a March Madness Scare Teaches Us About Athlete Breathing, The Hidden \"Spring Cleaning\" Asthma Trap",
    href: `${NEWSLETTER_URL}p/what-a-march-madness-scare-teaches-us-about-athlete-breathing-spring-cleaning-cough`,
    eyebrow: "CLAPS MD",
    image:
      "https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/ab488fc2-c5ff-4f21-8a89-efa4d8335661/Untitled_design-4.png?t=1775667180",
    publishedAt: "2026-04-08T17:30:00.000Z",
    readTime: "5 minutes",
  },
  {
    title: "Why Your Child's Snoring is a Red Flag",
    description:
      "Why your snoring child needs a pulmonologist, the great dairy myth, and NJ cherry blossoms.",
    href: `${NEWSLETTER_URL}p/when-cute-snoring-is-a-red-flag`,
    eyebrow: "CLAPS MD",
    image:
      "https://beehiiv-images-production.s3.amazonaws.com/uploads/publication/logo/577500d2-818a-4958-8e4d-e8a90ffa32d8/CLAPS.jpg",
    publishedAt: "2026-04-01T15:44:34.097Z",
    readTime: "4 minutes",
  },
  {
    title: "Out of Shape or Out of Air",
    description:
      "Why sniffles become wheezes, the great humidifier debate, and the surprising role of indoor humidity.",
    href: `${NEWSLETTER_URL}p/out-of-shape-or-out-of-air-9959`,
    eyebrow: "CLAPS MD",
    image:
      "https://beehiiv-images-production.s3.amazonaws.com/uploads/publication/logo/577500d2-818a-4958-8e4d-e8a90ffa32d8/CLAPS.jpg",
    publishedAt: "2026-03-25T17:00:00.000Z",
    readTime: "4 minutes",
  },
  {
    title: "Natural Anti-Inflammatory for the Lungs?",
    description:
      "Let's talk about food as medicine, the Gut-Lung axis, and spring break prep",
    href: `${NEWSLETTER_URL}p/natural-anti-inflammatory-for-the-lungs`,
    eyebrow: "Natural Anti-inflammatory for Lungs",
    image:
      "https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/33aa03f1-d235-4f13-b439-0313fbbd153a/Green_Artsy_Weekly_Newsletter_Email_Header-6.png?t=1773760533",
    publishedAt: "2026-03-18T12:29:19.208Z",
    readTime: "4 minutes",
  },
  {
    title: "Cold or Early Allergies? Your Spring Airway Playbook",
    description:
      "Breathing Room: CLAPS Family Health Guide",
    href: `${NEWSLETTER_URL}p/cold-or-early-allergies-your-spring-airway-playbook-inside`,
    eyebrow: "Breathless Athlete",
    image:
      "https://images.unsplash.com/photo-1503919483171-9ffc1debc390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODM4NTF8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjB8ZW58MHx8fHwxNzczMTU2OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=beehiiv&utm_medium=referral",
    publishedAt: "2026-03-11T16:33:23.104Z",
    readTime: "3 minutes",
  },
];

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeHref(href) {
  if (!href) return NEWSLETTER_URL;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("/")) return `${NEWSLETTER_URL.replace(/\/$/, "")}${href}`;
  return NEWSLETTER_URL;
}

function normalizeImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) return `${NEWSLETTER_URL.replace(/\/$/, "")}${src}`;
  return "";
}

function buildPostUrl(slug) {
  if (!slug) return NEWSLETTER_URL;
  return `${NEWSLETTER_URL}p/${String(slug).replace(/^\/+/, "")}`;
}

function findPostBlock(node) {
  if (!node || typeof node !== "object") return null;

  if (
    node.type === "post" &&
    Array.isArray(node?.attrs?.data?.posts) &&
    node.attrs.data.posts.length
  ) {
    return node.attrs.data.posts;
  }

  if (!Array.isArray(node.content)) return null;

  for (const child of node.content) {
    const found = findPostBlock(child);
    if (found) return found;
  }

  return null;
}

function parseNewsletterData(payload) {
  const posts = findPostBlock(payload?.page?.viewable_page_version?.content);

  if (!Array.isArray(posts) || !posts.length) {
    return [];
  }

  return posts.slice(0, 5).map((post) => ({
    title: stripTags(post.web_title || post.title),
    description: stripTags(post.web_subtitle || ""),
    href: buildPostUrl(post.slug),
    eyebrow:
      post.content_tags?.[0]?.display ||
      post.authors?.[0]?.name ||
      "Breathing Room",
    image: normalizeImageSrc(post.image_url || post.authors?.[0]?.profile_picture?.landscape?.url),
    publishedAt: post.override_scheduled_at || post.scheduled_at || "",
    readTime: post.estimated_reading_time_display || "",
  }));
}

function extractFromJsonLd(html) {
  const matches = [...String(html || "").matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  const posts = matches.flatMap((match) => {
    try {
      const parsed = JSON.parse(match[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      return items
        .filter((item) => item?.["@type"] === "BlogPosting" || item?.["@type"] === "Article")
        .map((item) => ({
          title: stripTags(item.headline || item.name),
          description: stripTags(item.description),
          href: normalizeHref(item.url),
          eyebrow: "Breathing Room",
          image: normalizeImageSrc(
            item.image?.url || item.image?.[0]?.url || item.image?.[0] || item.thumbnailUrl,
          ),
        }));
    } catch (_error) {
      return [];
    }
  });

  return posts.filter((post) => post.title);
}

function extractAnchorTopics(html) {
  const matches = [
    ...String(html || "").matchAll(
      /<a[^>]+href="([^"]*\/p\/[^"]+|[^"]*\/posts\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];

  const seen = new Set();

  return matches
    .map((match) => {
      const href = normalizeHref(match[1]);
      const text = stripTags(match[2]);
      const imageMatch = match[2].match(/<img[^>]+src="([^"]+)"/i);
      const title = text.split(/\s{2,}/)[0]?.trim() || text;
      if (!title || title.length < 12 || seen.has(title.toLowerCase())) return null;
      seen.add(title.toLowerCase());

      return {
        title,
        description: "",
        href,
        eyebrow: "Breathing Room",
        image: normalizeImageSrc(imageMatch?.[1] || ""),
      };
    })
    .filter(Boolean);
}

function parseNewsletterTopics(html) {
  const body = String(html || "");

  if (!body || /Just a moment/i.test(body) || /Enable JavaScript and cookies to continue/i.test(body)) {
    return [];
  }

  const topics = [...extractFromJsonLd(body), ...extractAnchorTopics(body)];
  const deduped = [];
  const seen = new Set();

  for (const topic of topics) {
    const key = String(topic.title || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(topic);
  }

  return deduped.slice(0, 5);
}

async function fetchTopicsFrom(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`Newsletter fetch failed with status ${response.status}`);
  }

  return parseNewsletterTopics(await response.text());
}

async function fetchTopicsFromDataUrl() {
  const response = await fetch(NEWSLETTER_DATA_URL, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      accept: "application/json,text/plain,*/*",
      "accept-language": "en-US,en;q=0.9",
    },
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`Newsletter data fetch failed with status ${response.status}`);
  }

  return parseNewsletterData(await response.json());
}

export async function getNewsletterTopics() {
  try {
    const topics = await fetchTopicsFromDataUrl();
    if (topics.length) {
      return topics;
    }
  } catch (_error) {
    // Fall through to the HTML scrape attempts and then static fallback.
  }

  const candidateUrls = [
    NEWSLETTER_URL,
    `${NEWSLETTER_URL}feed`,
    `${NEWSLETTER_URL}feed.xml`,
    `${NEWSLETTER_URL}rss`,
    `${NEWSLETTER_URL}rss.xml`,
  ];

  for (const url of candidateUrls) {
    try {
      const topics = await fetchTopicsFrom(url);
      if (topics.length) {
        return topics;
      }
    } catch (_error) {
      continue;
    }
  }

  return FALLBACK_TOPICS;
}

export { FALLBACK_TOPICS, NEWSLETTER_DATA_URL, NEWSLETTER_URL };
