import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const root = process.cwd();
const files = [
  "C:/Users/Admin/Downloads/SiteBuilderExport2026-05-15-05_32_49.xml",
  "C:/Users/Admin/Downloads/SiteExport_27201_2026-05-15-05_32_32.xml",
  "C:/Users/Admin/Downloads/CategoryExport (3).xml",
];

const outDir = path.join(root, "docs", "csb-exports");
const summaryPath = path.join(outDir, "csb-export-analysis.md");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function walk(node, visitor, pathParts = []) {
  if (node == null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, index) => walk(item, visitor, [...pathParts, `[${index}]`]));
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("@_") || key === "#text") continue;
    visitor(key, value, pathParts);
    walk(value, visitor, [...pathParts, key]);
  }
}

function collectTagNames(obj) {
  const counts = new Map();
  walk(obj, (key) => counts.set(key, (counts.get(key) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function collectObjectsByTag(obj, tagName) {
  const results = [];
  walk(obj, (key, value, pathParts) => {
    if (key === tagName) {
      for (const item of asArray(value)) {
        if (item && typeof item === "object") {
          results.push({ item, path: [...pathParts, key].join("/") });
        }
      }
    }
  });
  return results;
}

function previewObject(item) {
  const out = {};
  for (const [key, value] of Object.entries(item)) {
    if (key === "#text") continue;
    if (key.startsWith("@_")) {
      out[key.slice(2)] = value;
    } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = String(value).slice(0, 140);
    } else if (value && typeof value === "object") {
      const text = typeof value["#text"] === "string" ? value["#text"] : "";
      if (text) out[key] = text.slice(0, 140);
    }
  }
  return out;
}

function findTextMatches(raw, patterns) {
  const lines = raw.split(/\r?\n/);
  const matches = [];
  lines.forEach((line, idx) => {
    for (const pattern of patterns) {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        matches.push({ line: idx + 1, pattern, text: line.trim().slice(0, 220) });
        break;
      }
    }
  });
  return matches.slice(0, 80);
}

const analyses = [];
for (const file of files) {
  const raw = await fs.readFile(file, "utf8");
  const xml = parser.parse(raw);
  const tagCounts = collectTagNames(xml);
  const interestingTags = [
    "page",
    "Page",
    "component",
    "Component",
    "category",
    "Category",
    "brand",
    "Brand",
    "locale",
    "Locale",
    "style",
    "Style",
    "setting",
    "Setting",
    "navigation",
    "Navigation",
    "menu",
    "Menu",
    "layout",
    "Layout",
    "content",
    "Content",
  ];
  const sampleByTag = {};
  for (const tag of interestingTags) {
    const matches = collectObjectsByTag(xml, tag).slice(0, 12).map(({ item, path }) => ({
      path,
      ...previewObject(item),
    }));
    if (matches.length) sampleByTag[tag] = matches;
  }
  const textMatches = findTextMatches(raw, [
    "Home",
    "Search Jobs",
    "Talent",
    "Category",
    "header",
    "footer",
    "Arabian",
    "Drilling",
    "style",
    "font",
    "color",
    "locale",
    "brand",
  ]);
  analyses.push({
    file,
    bytes: raw.length,
    rootKeys: Object.keys(xml),
    topTags: tagCounts.slice(0, 35),
    sampleByTag,
    textMatches,
  });
}

function mdEscape(text) {
  return String(text ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

let md = "# CSB Export Analysis\n\n";
md += "Generated from the current CSB exports supplied on 2026-05-15.\n\n";

for (const analysis of analyses) {
  md += `## ${path.basename(analysis.file)}\n\n`;
  md += `- Path: \`${analysis.file}\`\n`;
  md += `- Size: ${analysis.bytes.toLocaleString()} characters\n`;
  md += `- Root keys: ${analysis.rootKeys.map((k) => `\`${k}\``).join(", ")}\n\n`;

  md += "### Most Frequent Tags\n\n";
  md += "| Tag | Count |\n|---|---:|\n";
  for (const [tag, count] of analysis.topTags) {
    md += `| \`${mdEscape(tag)}\` | ${count} |\n`;
  }
  md += "\n";

  if (Object.keys(analysis.sampleByTag).length) {
    md += "### Sample Structured Objects\n\n";
    for (const [tag, samples] of Object.entries(analysis.sampleByTag)) {
      md += `#### \`${tag}\`\n\n`;
      md += "| Path | Preview |\n|---|---|\n";
      for (const sample of samples) {
        const { path: samplePath, ...preview } = sample;
        md += `| ${mdEscape(samplePath)} | ${mdEscape(JSON.stringify(preview))} |\n`;
      }
      md += "\n";
    }
  }

  md += "### Text Matches\n\n";
  md += "| Line | Match | Text |\n|---:|---|---|\n";
  for (const match of analysis.textMatches) {
    md += `| ${match.line} | ${mdEscape(match.pattern)} | ${mdEscape(match.text)} |\n`;
  }
  md += "\n";
}

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(summaryPath, md, "utf8");
console.log(summaryPath);
