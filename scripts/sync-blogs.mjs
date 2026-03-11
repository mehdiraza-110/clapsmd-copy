import { promises as fs } from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const blogMaterialsDir = path.join(workspaceRoot, "blog-materials");
const outputPath = path.join(workspaceRoot, "src", "lib", "blogPosts.js");
const SEO_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseFrontMatter(rawContent) {
  const trimmed = rawContent.trimStart();
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: rawContent };
  }

  const endIndex = trimmed.indexOf("---", 3);
  if (endIndex === -1) {
    return { data: {}, body: rawContent };
  }

  const frontMatterRaw = trimmed.slice(3, endIndex).trim();
  const body = trimmed.slice(endIndex + 3).trim();
  const data = {};

  for (const line of frontMatterRaw.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue;
    }
    const separatorIndex = trimmedLine.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();
    if (value.startsWith("\"") && value.endsWith("\"")) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}

function normalizeParagraph(paragraph) {
  return paragraph.replace(/\s+/g, " ").trim();
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function isNonEmptyString(value) {
  return typeof value === "string" && normalizeWhitespace(value).length > 0;
}

function validateRequiredField(postFile, fieldName, value) {
  if (!isNonEmptyString(value)) {
    return `${postFile}: missing required frontmatter field "${fieldName}"`;
  }
  return null;
}

function parseContentBlocks(body) {
  const blocks = body.split(/\n\s*\n/).map((block) => block.trim());
  const content = [];

  for (const block of blocks) {
    if (!block) {
      continue;
    }

    // Check for image: ![alt](src)
    const imgMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      content.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      continue;
    }

    const lines = block.split(/\r?\n/).map((line) => line.trim());
    const listItems = lines
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim())
      .filter(Boolean);

    if (listItems.length > 0) {
      content.push({ type: "list", items: listItems });
      continue;
    }

    content.push({ type: "paragraph", text: normalizeParagraph(block) });
  }

  return content;
}

function sortByPublishedDate(posts) {
  return posts.sort((a, b) => {
    const aDate = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bDate = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bDate - aDate;
  });
}

async function loadMarkdownPosts() {
  const entries = await fs.readdir(blogMaterialsDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  const posts = [];
  const validationErrors = [];

  for (const fileName of markdownFiles) {
    const fullPath = path.join(blogMaterialsDir, fileName);
    const rawContent = await fs.readFile(fullPath, "utf-8");
    const { data, body } = parseFrontMatter(rawContent);
    const contentBlocks = parseContentBlocks(body);
    const normalizedTitle = isNonEmptyString(data.title)
      ? normalizeWhitespace(data.title)
      : "";
    const normalizedSlug = isNonEmptyString(data.slug)
      ? normalizeWhitespace(data.slug)
      : "";
    const normalizedDescription = isNonEmptyString(data.description)
      ? normalizeWhitespace(data.description)
      : "";

    const requiredErrors = [
      validateRequiredField(fileName, "title", data.title),
      validateRequiredField(fileName, "slug", data.slug),
      validateRequiredField(fileName, "description", data.description),
    ].filter(Boolean);
    validationErrors.push(...requiredErrors);

    if (isNonEmptyString(data.slug) && !SEO_SLUG_PATTERN.test(normalizedSlug)) {
      validationErrors.push(
        `${fileName}: invalid slug "${normalizedSlug}". Expected pattern: ${SEO_SLUG_PATTERN}`
      );
    }

    posts.push({
      title: normalizedTitle,
      slug: normalizedSlug,
      description: normalizedDescription,
      coverImage: data.coverImage ?? null,
      publishedAt: data.publishedAt ?? "",
      updatedAt: data.updatedAt ?? data.publishedAt ?? "",
      content: contentBlocks,
    });
  }

  if (validationErrors.length > 0) {
    throw new Error(
      `Blog frontmatter validation failed:\n- ${validationErrors.join("\n- ")}`
    );
  }

  return sortByPublishedDate(posts);
}

function buildOutput(posts) {
  const payload = `export const blogPosts = ${JSON.stringify(posts, null, 2)};\n\n` +
    `export function getBlogPostBySlug(slug) {\n` +
    `  if (!slug) return null;\n` +
    `  return blogPosts.find((post) => post.slug.toLowerCase() === slug.toLowerCase());\n` +
    `}\n`;

  return `// This file is generated by scripts/sync-blogs.mjs.\n${payload}`;
}

async function main() {
  const posts = await loadMarkdownPosts();
  const output = buildOutput(posts);
  await fs.writeFile(outputPath, output);
  console.log(`Updated ${outputPath} with ${posts.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
