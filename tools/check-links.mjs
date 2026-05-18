import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ignoredDirs = new Set([".git", "node_modules", "sf-scan"]);

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

const htmlFiles = walk(process.cwd());
const linkPattern = /\b(?:href|src)=["']([^"']+)["']/g;
const missing = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(linkPattern)) {
    const rawTarget = match[1];

    if (
      rawTarget.startsWith("#") ||
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("tel:") ||
      rawTarget.startsWith("data:")
    ) {
      continue;
    }

    const target = rawTarget.split("#")[0].split("?")[0];
    const targetPath = resolve(dirname(file), target);
    if (target && (!existsSync(targetPath) || !statSync(targetPath).isFile())) {
      missing.push(`${file} -> ${rawTarget}`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Missing local links:\n${missing.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files. All local links resolve.`);
}
