import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules"]);

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...walk(join(dir, entry.name)));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(join(dir, entry.name));
    }
  }

  return files;
}

function cleanText(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(html, pattern) {
  const globalPattern = pattern.global ? pattern : new RegExp(pattern.source, `${pattern.flags}g`);
  return [...html.matchAll(globalPattern)].map((match) => cleanText(match[1])).filter(Boolean);
}

function attrMatches(html, tagPattern, attr) {
  const values = [];
  for (const match of html.matchAll(tagPattern)) {
    const tag = match[0];
    const attrMatch = tag.match(new RegExp(`${attr}=["']([^"']+)["']`, "i"));
    if (attrMatch?.[1]) {
      values.push(attrMatch[1]);
    }
  }
  return values;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function pageSummary(file) {
  const html = readFileSync(file, "utf8");
  const rel = relative(root, file).replaceAll("\\", "/");
  const title = matches(html, /<title[^>]*>([\s\S]*?)<\/title>/i)[0] || "(no title)";
  const descriptionMatch = html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = cleanText(descriptionMatch?.[1] || "");
  const h1 = matches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2 = matches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3 = matches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  const buttons = matches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi);
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: match[1],
    text: cleanText(match[2])
  })).filter((link) => link.text);
  const images = attrMatches(html, /<img\b[^>]*>/gi, "src");
  const forms = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/gi)].map((match) => {
    const fields = attrMatches(match[1], /<(?:input|select|textarea)\b[^>]*>/gi, "name");
    const labels = matches(match[1], /<label[^>]*>([\s\S]*?)<\/label>/gi);
    return { fields: unique(fields), labels: unique(labels) };
  });
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const bodyText = cleanText(mainMatch?.[1] || html);
  const words = bodyText ? bodyText.split(/\s+/).length : 0;

  return {
    rel,
    title,
    description,
    h1,
    h2,
    h3,
    buttons: unique(buttons),
    internalLinks: anchors.filter((link) => !/^(https?:|mailto:|tel:|#)/i.test(link.href)),
    externalLinks: anchors.filter((link) => /^(https?:|mailto:|tel:)/i.test(link.href)),
    images: unique(images),
    forms,
    words,
    contentPreview: bodyText.split(" ").slice(0, 45).join(" ")
  };
}

function pageType(rel) {
  if (rel.startsWith("docs/")) return "Documentation";
  if (rel.startsWith("v2/")) return "V2 prototype";
  if (rel === "index.html") return "Homepage";
  if (rel.includes("job") || rel.includes("apply")) return "Jobs and application";
  if (rel.includes("profile") || rel.includes("talent-community")) return "Candidate account and CRM";
  if (rel.includes("privacy") || rel.includes("fraud") || rel.includes("ethical")) return "Trust and policy";
  return "Content page";
}

const pages = walk(root).map(pageSummary).sort((a, b) => a.rel.localeCompare(b.rel));
const groups = Map.groupBy(pages, (page) => pageType(page.rel));

const lines = [
  "# AD Careers Site Content Inventory",
  "",
  `Generated from ${pages.length} HTML files in \`${root}\`.`,
  "",
  "## Summary",
  "",
  `- Root pages: ${pages.filter((page) => !page.rel.includes("/")).length}`,
  `- Nested pages: ${pages.filter((page) => page.rel.includes("/")).length}`,
  `- Pages with forms: ${pages.filter((page) => page.forms.length > 0).length}`,
  `- Pages with images: ${pages.filter((page) => page.images.length > 0).length}`,
  "",
  "## Page Inventory",
  ""
];

for (const [group, groupPages] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`### ${group}`, "");

  for (const page of groupPages) {
    lines.push(`#### ${page.rel}`);
    lines.push("");
    lines.push(`- Title: ${page.title}`);
    if (page.description) lines.push(`- Meta description: ${page.description}`);
    if (page.h1.length) lines.push(`- H1: ${page.h1.join(" | ")}`);
    if (page.h2.length) lines.push(`- H2 sections: ${page.h2.join(" | ")}`);
    if (page.h3.length) lines.push(`- H3 content: ${page.h3.slice(0, 12).join(" | ")}${page.h3.length > 12 ? " | ..." : ""}`);
    if (page.buttons.length) lines.push(`- Buttons: ${page.buttons.join(" | ")}`);
    if (page.forms.length) {
      const formDetails = page.forms.map((form, index) => {
        const fields = form.fields.length ? form.fields.join(", ") : "no named fields";
        const labels = form.labels.length ? ` labels: ${form.labels.join(", ")}` : "";
        return `form ${index + 1}: ${fields}${labels}`;
      }).join(" / ");
      lines.push(`- Forms: ${formDetails}`);
    }
    lines.push(`- Local links: ${unique(page.internalLinks.map((link) => link.href.split("#")[0].split("?")[0])).filter(Boolean).length}`);
    lines.push(`- External/contact links: ${page.externalLinks.length}`);
    lines.push(`- Images/assets referenced: ${page.images.length}`);
    lines.push(`- Approx. main content words: ${page.words}`);
    if (page.contentPreview) lines.push(`- Preview: ${page.contentPreview}`);
    lines.push("");
  }
}

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "content-inventory.md"), `${lines.join("\n")}\n`);
console.log(`Inventory written for ${pages.length} pages: docs/content-inventory.md`);
