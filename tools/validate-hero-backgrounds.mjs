import { existsSync, readFileSync, readdirSync } from "node:fs";

const css = readFileSync("styles.css", "utf8");
const cssUrls = [...css.matchAll(/url\("([^"]+)"\)/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith("design-system/"));
const missingAssets = [...new Set(cssUrls)].filter((url) => !existsSync(url));

const htmlFiles = readdirSync(process.cwd()).filter((name) => name.endsWith(".html"));
const missingClasses = [];

for (const file of htmlFiles) {
  const slug = file
    .replace(/\.html$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const html = readFileSync(file, "utf8");
  const bodyMatch = html.match(/<body[^>]*class="([^"]*)"/i);

  if (!bodyMatch?.[1].split(/\s+/).includes(`page-${slug}`)) {
    missingClasses.push(file);
  }
}

if (missingAssets.length || missingClasses.length) {
  if (missingAssets.length) {
    console.error(`Missing CSS assets:\n${missingAssets.join("\n")}`);
  }
  if (missingClasses.length) {
    console.error(`Missing root page classes:\n${missingClasses.join("\n")}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Validated ${new Set(cssUrls).size} CSS image assets and ${htmlFiles.length} root page classes.`);
}
