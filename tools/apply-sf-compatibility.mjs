import { readFile, readdir, writeFile } from "node:fs/promises";

const categoryPages = new Set([
  "job-areas.html",
  "onshore-drilling-jobs.html",
  "offshore-drilling-jobs.html",
  "hse-jobs.html",
  "maintenance-engineering-jobs.html",
  "supply-chain-logistics-jobs.html",
  "corporate-jobs.html",
  "entry-level-jobs.html",
  "professionals.html",
  "students-graduates.html",
  "graduate-program.html",
  "internships.html",
  "field-stories.html",
  "graduate-stories.html",
  "leadership-stories.html",
]);

const addClasses = (classValue, additions) => {
  const classes = new Set(classValue.split(/\s+/).filter(Boolean));
  for (const item of additions) classes.add(item);
  return [...classes].join(" ");
};

const bodyClassesFor = (file) => {
  if (file === "index.html") return ["coreCSB", "home-page", "body"];
  if (file === "jobs.html") return ["coreCSB", "search-page", "body"];
  if (file === "talent-community.html" || file === "talent-community-members.html") {
    return ["coreCSB", "talentcommunity-page", "body"];
  }
  if (categoryPages.has(file) || file.startsWith("story-")) {
    return ["coreCSB", "talentlanding-page", "body"];
  }
  return ["coreCSB", "content-page", "body"];
};

const files = (await readdir(".")).filter((file) => file.endsWith(".html"));

for (const file of files) {
  let html = await readFile(file, "utf8");

  html = html.replace(/<body class="([^"]*)">/, (_match, classes) => {
    const merged = addClasses(classes, bodyClassesFor(file));
    return `<body class="${merged}" id="body">`;
  });

  html = html.replace(/<body class="([^"]*)" id="body">/, (_match, classes) => {
    const merged = addClasses(classes, bodyClassesFor(file));
    return `<body class="${merged}" id="body">`;
  });

  html = html.replace(
    /<header(?![^>]*\bid=)["']?\s*class="([^"]*)"/,
    (_match, classes) => `<header id="header" class="${addClasses(classes, ["headermain", "navbar", "navbar-default", "navbar-fixed-top"])}"`,
  );

  html = html.replace(
    /<header id="header" class="([^"]*)"/,
    (_match, classes) => `<header id="header" class="${addClasses(classes, ["headermain", "navbar", "navbar-default", "navbar-fixed-top"])}"`,
  );

  html = html.replaceAll('href="#main"', 'href="#content"');
  html = html.replace(/<main id="main"(?![^>]*\bclass=)>/, '<main id="content" class="content" role="main" data-prototype-id="main">');
  html = html.replace(/<main id="main" class="([^"]*)"(?: role="main")?(?: data-sf-id="content")?>/, (_match, classes) => `<main id="content" class="${addClasses(classes, ["content"])}" role="main" data-prototype-id="main">`);
  html = html.replace(/<main id="content" class="([^"]*)"(?![^>]*data-prototype-id)/, (_match, classes) => `<main id="content" class="${addClasses(classes, ["content"])}" role="main" data-prototype-id="main"`);

  html = html.replace(/<footer(?![^>]*\bid=)\s+class="([^"]*)"/, (_match, classes) => `<footer id="footer" class="${addClasses(classes, ["footerRow"])}"`);
  html = html.replace(/<footer id="footer" class="([^"]*)"/, (_match, classes) => `<footer id="footer" class="${addClasses(classes, ["footerRow"])}"`);

  if (file === "index.html") {
    html = html.replace('class="search-box"', 'class="search-box form-inline jobAlertsSearchForm" name="keywordsearch" role="search"');
    html = html.replace('placeholder="Search by job title or keyword"', 'class="keywordsearch-q columnized-search" name="q" placeholder="Search by job title or keyword"');
    html = html.replace('<button class="btn primary">Search jobs</button>', '<button class="btn primary keywordsearch-button">Search jobs</button>');
    html = html.replace('class="section corporate-icon-feature"', 'class="section corporate-icon-feature twocolumn displayDTM"');
    html = html.replace('<section class="section">\n  <div class="container">\n    <div class="section-head">\n      <div><span class="kicker">Explore Careers</span>', '<section class="section threeimagecaption display">\n  <div class="container">\n    <div class="section-head">\n      <div><span class="kicker">Explore Careers</span>');
    html = html.replace('<section class="section" style="background:var(--ad-mint)">', '<section class="section featuredjobs display" style="background:var(--ad-mint)">');
    html = html.replaceAll('class="ad-arrow-link"', 'class="ad-arrow-link threeimagecaption-link"');
  }

  if (file === "jobs.html") {
    html = html.replace('class="search-box enhanced-filter-bar"', 'class="search-box enhanced-filter-bar form-inline jobAlertsSearchForm" name="keywordsearch" role="search"');
    html = html.replace('name="keyword" placeholder="Role, skill, or keyword"', 'name="q" class="keywordsearch-q columnized-search" placeholder="Role, skill, or keyword"');
    html = html.replace('<button class="btn primary">Search</button>', '<button class="btn primary keywordsearch-button">Search</button>');
    html = html.replace('<div class="jobs-list" data-job-results>', '<div id="job-table" class="jobs-list searchResultsShell" data-job-results>');
    html = html.replaceAll('class="job-card"', 'class="job-card searchResults"');
  }

  if (file === "talent-community.html") {
    html = html.replace('class="section talent-account-section"', 'class="section talent-account-section tcjoin displayDTM"');
    html = html.replace('class="card form talent-register-form"', 'class="card form talent-register-form join-form form-control-100"');
    html = html.replace('name="email" type="email"', 'name="email" class="join-email form-control" type="email"');
    html = html.replace('class="btn primary" type="submit">Create Account</button>', 'class="btn primary join-submit" type="submit">Create Account</button>');
  }

  if (categoryPages.has(file)) {
    html = html.replace('class="job-area-hub-grid ad-document-grid"', 'class="job-area-hub-grid ad-document-grid threeimagecaption display"');
    html = html.replaceAll('class="ad-arrow-link"', 'class="ad-arrow-link threeimagecaption-link"');
  }

  await writeFile(file, html, "utf8");
}
