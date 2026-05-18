import { readFileSync, readdirSync, writeFileSync } from "node:fs";

for (const file of readdirSync(process.cwd()).filter((name) => name.endsWith(".html"))) {
  const slug = file
    .replace(/\.html$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const className = `page-${slug}`;
  const html = readFileSync(file, "utf8");

  const nextHtml = html.replace(/<body([^>]*)>/i, (match, attributes) => {
    const classMatch = attributes.match(/class=["']([^"']*)["']/i);

    if (!classMatch) {
      return `<body${attributes} class="${className}">`;
    }

    const classes = classMatch[1].split(/\s+/).filter(Boolean);
    if (classes.includes(className)) {
      return match;
    }

    return `<body${attributes.replace(classMatch[0], `class="${[...classes, className].join(" ")}"`)}>`;
  });

  if (nextHtml !== html) {
    writeFileSync(file, nextHtml);
  }
}

console.log("Added page classes to root HTML files.");
