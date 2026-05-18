import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const faviconLinks = `  <link rel="apple-touch-icon" sizes="144x144" href="design-system/corporate/ico/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon" sizes="114x114" href="design-system/corporate/ico/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon" sizes="72x72" href="design-system/corporate/ico/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon" href="design-system/corporate/ico/apple-touch-icon-57-precomposed.png">
  <link rel="icon" type="image/png" href="design-system/corporate/ico/favicon.png">
  <link rel="shortcut icon" href="design-system/corporate/ico/favicon.png">
`;

const faviconPattern = /\s*<link[^>]+rel=["'](?:apple-touch-icon|shortcut icon|icon)["'][^>]*>\r?\n?/gi;

for (const file of readdirSync(process.cwd()).filter((name) => name.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  let nextHtml = html.replace(faviconPattern, "\n");

  if (!nextHtml.includes("design-system/corporate/ico/favicon.png")) {
    nextHtml = nextHtml.replace(/(\s*<link rel="stylesheet" href="styles\.css[^"]*">\s*)/i, `\n${faviconLinks}$1`);
  }

  nextHtml = nextHtml.replace(
    /(<link rel="shortcut icon" href="design-system\/corporate\/ico\/favicon\.png">)\s+(<link rel="stylesheet")/g,
    "$1\n  $2"
  );

  if (nextHtml !== html) {
    writeFileSync(file, nextHtml);
  }
}

console.log("Applied local corporate favicon links to root HTML pages.");
