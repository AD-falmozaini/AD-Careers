import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = process.cwd();
const outputDir = path.join(root, "outputs", "csb-migration");
const outputPath = path.join(outputDir, "arabian-drilling-csb-migration-workbook.xlsx");

const COLORS = {
  green: "#003C34",
  orange: "#FF5A00",
  gold: "#E5A93F",
  light: "#F4F6F5",
  paleGold: "#FBF3DF",
  white: "#FFFFFF",
  text: "#24312F",
  border: "#D8E0DD",
};

const pageTypeRules = [
  [/^index\.html$/, ["Home Page", "Pages > Home"]],
  [/^jobs\.html$/, ["Search / Job Results", "Native search/results page"]],
  [/^job-detail\.html$/, ["Job Detail", "Layouts > Job"]],
  [/^apply-/, ["Application Flow", "SuccessFactors apply flow / RCM"]],
  [/talent-community/, ["Talent Community", "Native Talent Community / Data Capture Form"]],
  [/profile/, ["Candidate Account", "Native candidate profile / login"]],
  [/stories|story-/, ["Content Page", "Pages > Content"]],
  [/jobs\.html$/, ["Category Page", "Pages > Category"]],
  [/faq|privacy|fraud|process/, ["Content Page", "Pages > Content"]],
];

function pickPageType(file) {
  for (const [pattern, result] of pageTypeRules) {
    if (pattern.test(file)) return result;
  }
  return ["Content Page", "Pages > Content"];
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchOne(html, regex) {
  const match = html.match(regex);
  return match ? stripTags(match[1]) : "";
}

function countMatches(html, regex) {
  return (html.match(regex) || []).length;
}

async function listPrototypePages() {
  const names = await fs.readdir(root);
  const htmlFiles = names
    .filter((name) => name.endsWith(".html"))
    .filter((name) => !["icons-preview.html", "seo-inventory.html", "arabic.html"].includes(name))
    .sort((a, b) => a.localeCompare(b));

  const rows = [];
  for (const file of htmlFiles) {
    const html = await fs.readFile(path.join(root, file), "utf8");
    const title = matchOne(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const h1 = matchOne(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2Count = countMatches(html, /<h2\b/gi);
    const formCount = countMatches(html, /<form\b/gi);
    const imageCount = countMatches(html, /<img\b/gi);
    const [pageType, csbArea] = pickPageType(file);
    const priority = file === "index.html" || file === "jobs.html" || file === "job-detail.html" || file === "talent-community.html" ? "P1" : file.includes("story-") ? "P3" : "P2";
    rows.push([
      priority,
      file,
      h1 || title.replace(" | Arabian Drilling Careers", ""),
      pageType,
      csbArea,
      h2Count,
      formCount,
      imageCount,
      pageType === "Job Detail" ? "Use native Job Tokens for dynamic requisition fields; keep custom content minimal." :
        pageType === "Category Page" ? "Build as CSB category page with rules where job filtering is needed." :
        file.includes("story-") ? "Consider reusable story custom plugin or standard Text components if layout can be simplified." :
        "Map sections to native components first; custom plugin only for design-critical gaps.",
      "To map",
    ]);
  }
  return rows;
}

function setTitle(sheet, title, subtitle = "") {
  sheet.showGridLines = false;
  const titleRange = sheet.getRange("A1:H1");
  titleRange.merge();
  titleRange.values = [[title]];
  titleRange.format.fill = { color: COLORS.green };
  titleRange.format.font = { color: COLORS.white, bold: true, size: 18 };
  titleRange.format.rowHeightPx = 34;
  if (subtitle) {
    const sub = sheet.getRange("A2:H2");
    sub.merge();
    sub.values = [[subtitle]];
    sub.format.fill = { color: COLORS.light };
    sub.format.font = { color: COLORS.text, italic: true };
    sub.format.rowHeightPx = 28;
  }
}

function writeTable(sheet, startCell, headers, rows, tableName) {
  const range = sheet.getRange(startCell).resize(rows.length + 1, headers.length);
  range.values = [headers, ...rows];
  range.format.wrapText = true;
  range.format.font = { color: COLORS.text, size: 10 };
  const headerRange = range.getRow(0);
  headerRange.format.fill = { color: COLORS.green };
  headerRange.format.font = { color: COLORS.white, bold: true };
  headerRange.format.rowHeightPx = 34;
  if (rows.length) {
    const dataRange = range.offset(1, 0).resize(rows.length, headers.length);
    dataRange.format.fill = { color: COLORS.white };
    dataRange.format.rowHeightPx = 42;
  }
  return range;
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 250, 1).format.columnWidthPx = width;
  });
}

const workbook = Workbook.create();

const summary = workbook.worksheets.add("Executive Summary");
setTitle(summary, "Arabian Drilling Careers - CSB Migration Workbook", "Working handoff for moving the prototype into SAP SuccessFactors Career Site Builder.");
summary.getRange("A4:B12").values = [
  ["Migration Principle", "Use native CSB components first; reserve Custom Plugin for sections CSB cannot express cleanly."],
  ["Target Admin Area", "Admin Center > Manage Career Site Builder"],
  ["Primary Build Surface", "Global styles, header/footer, pages, category pages, job layouts, talent community, image library"],
  ["Design Source", "Local AD Careers prototype plus Arabian Drilling corporate visual language"],
  ["Implementation Risk", "Custom JavaScript/CSS can break SAP-managed candidate flows if it manipulates native components."],
  ["Recommended Path", "Rebuild in CSB Stage, QA end-to-end, export/import to Production."],
  ["Owner Model", "SF admin/implementation partner owns CSB config; design team owns visual specs and approved content."],
  ["Next Milestone", "Validate workbook against the actual Stage CSB export and update statuses."],
  ["Last Updated", "2026-05-15"],
];
summary.getRange("A4:A12").format.fill = { color: COLORS.paleGold };
summary.getRange("A4:A12").format.font = { bold: true, color: COLORS.green };
summary.getRange("B4:B12").format.wrapText = true;
summary.getRange("B4:B12").format.font = { color: COLORS.text };
summary.getRange("A15:H15").values = [["Phase", "Purpose", "Key Activities", "Deliverable", "Owner", "Dependency", "Risk", "Status"]];
const phaseRows = [
  ["1. CSB Access & Export", "Understand current tenant", "Confirm permissions, export Site Settings, CSB Settings, Category Pages", "Baseline export package", "SF Admin", "Stage access", "Wrong environment or missing permissions", "Not started"],
  ["2. Design Mapping", "Translate prototype to CSB model", "Map every page/section to CSB component or plugin", "Approved component matrix", "UX + SF Admin", "Page inventory", "Over-customization", "In progress"],
  ["3. Asset Prep", "Prepare upload-ready media", "Optimize images, logo, favicon, fonts, alt text", "Asset library pack", "Design", "Final imagery", "Large files or missing rights", "Not started"],
  ["4. Stage Build", "Configure in CSB", "Global styles, header/footer, pages, categories, job layout, Talent Community", "Stage career site", "SF Admin / Partner", "Approved matrix", "Native component constraints", "Not started"],
  ["5. QA", "Prove candidate journeys", "Responsive, contrast, search, apply, profile, job alerts, source tracking", "QA signoff", "HR + UX + IT", "Stage build", "Application flow regressions", "Not started"],
  ["6. Production Move", "Launch safely", "Export Stage, import Production, smoke test, monitor", "Production launch", "SF Admin", "QA signoff", "Import overwrites config", "Not started"],
];
summary.getRange("A16:H21").values = phaseRows;
const phaseRange = summary.getRange("A15:H21");
phaseRange.format.wrapText = true;
phaseRange.getRow(0).format.fill = { color: COLORS.green };
phaseRange.getRow(0).format.font = { color: COLORS.white, bold: true };
summary.freezePanes.freezeRows(15);
setWidths(summary, [130, 190, 300, 180, 150, 160, 220, 110]);

const pageRows = await listPrototypePages();
const pageMap = workbook.worksheets.add("Page Migration Map");
setTitle(pageMap, "Page Migration Map", "Each current prototype page mapped to the recommended CSB surface.");
writeTable(pageMap, "A4", ["Priority", "Prototype File", "Page / H1", "Recommended CSB Page Type", "CSB Admin Area", "H2 Count", "Forms", "Images", "Migration Notes", "Build Status"], pageRows, "PageMigrationMap");
pageMap.freezePanes.freezeRows(4);
setWidths(pageMap, [75, 230, 260, 170, 210, 80, 70, 75, 380, 120]);

const sectionMap = workbook.worksheets.add("Section Component Map");
setTitle(sectionMap, "Section to CSB Component Map", "Use this to decide what becomes native CSB configuration and what needs a controlled plugin.");
const sectionRows = [
  ["Global Header", "All pages", "Custom Header", "Appearance > Styles > Headers", "Native", "Logo, menu, profile/sign-in, search jobs CTA", "High", "Mirror current nav; public and internal share header/footer."],
  ["Footer", "All pages", "Footer editor", "Appearance > Styles > Footers", "Native", "Explore, Life at AD, Candidate Help, Connect", "High", "Keep links close to live SF footer structure."],
  ["Home hero with search", "index.html", "Large Image + Keyword Search", "Pages > Home", "Native + light CSS", "Hero image, headline, keyword/location/job area search", "High", "Use native search form where possible."],
  ["Corporate proof icon section", "index.html and selected pages", "Text / Custom Plugin", "Pages > Home / Content", "Hybrid", "Large line icon, proof statement, metric", "Medium", "Native text may suffice; plugin if exact lockup is required."],
  ["Careers counter section", "index.html", "Custom Plugin", "Pages > Home", "Plugin", "Candidate-focused counters and image cards", "Medium", "Keep independent; avoid touching native search/job scripts."],
  ["Career family tiles", "job-areas.html", "Three Column Images with Caption or Custom Plugin", "Pages > Content", "Hybrid", "Six job family cards with icons and links", "High", "Native three-column may need two stacked components."],
  ["Function page intro panel", "onshore/hse/maintenance pages", "Text Component", "Pages > Category or Content", "Native", "Headline, body, two CTAs", "High", "Current prototype style can be simplified into CSB text component."],
  ["Function snapshots", "Career-area pages", "Text / Three Column Images", "Pages > Content", "Native", "Three summary cards", "Medium", "Use standard components for maintainability."],
  ["Featured role cards", "Career-area pages", "Featured Jobs", "Pages > Category / Content", "Native", "Relevant open roles", "High", "Use live job data/category rules, not hardcoded prototype cards."],
  ["Employee story galleries", "employee-stories.html", "Custom Plugin or Image/Text component", "Pages > Content", "Plugin candidate", "Employee cards grouped by Field/Graduate/Leadership", "Medium", "Plugin gives best gallery control."],
  ["Individual story pages", "story-*.html", "Text + Custom Plugin", "Pages > Content", "Hybrid", "Bio, career details, FAQ-style Q&A", "Medium", "Reusable plugin template recommended."],
  ["Talent Community form", "talent-community.html", "Data Capture Form / Talent Community", "Pages / Talent Community", "Native", "Account fields, job interests, consent", "Critical", "Do not rebuild application/profile logic as custom code."],
  ["Job results", "jobs.html", "Search Results", "Native search/results page", "Native", "Keyword, location, filters, job list", "Critical", "Use SF classes and native result components."],
  ["Job detail", "job-detail.html", "Custom Job Layout", "Layouts > Job", "Native + limited Text", "Job tokens, apply CTA, related jobs", "Critical", "Use Job Token components for dynamic data."],
  ["Application", "apply-hse-officer.html", "RCM Apply Flow", "Recruiting Management", "Native", "Candidate application workflow", "Critical", "Prototype is only visual reference; SF owns apply flow."],
];
writeTable(sectionMap, "A4", ["Prototype Section", "Example Page(s)", "Recommended CSB Component", "CSB Admin Path", "Build Method", "Content / Behavior", "Priority", "Notes"], sectionRows, "SectionComponentMap");
sectionMap.freezePanes.freezeRows(4);
setWidths(sectionMap, [210, 210, 240, 220, 130, 330, 90, 360]);

const settings = workbook.worksheets.add("Global CSB Settings");
setTitle(settings, "Global CSB Settings", "Admin configuration items to confirm before page build starts.");
const settingRows = [
  ["Access", "Manage Career Site Builder permission", "Admin Center > Manage Permission Roles", "Confirm named admins have Manage Career Site Builder and Recruiter RMK SSO Permission.", "SF Admin", "Open"],
  ["Brand", "Arabian Drilling brand", "Tools > Brand Management", "Confirm logo, brand colors, locale behavior, and branded search results.", "SF Admin", "Open"],
  ["Locales", "English / Arabic readiness", "Settings > Site Configuration > Site Locales", "Confirm required locales and whether Arabic RTL is in launch scope.", "HR + SF Admin", "Decision"],
  ["Fonts", "Certo Sans or SF-supported substitute", "Appearance > Global / Fonts", "Upload approved font if licensed and supported; otherwise select closest stable font.", "Design + SF Admin", "Open"],
  ["Colors", "Green, orange, gold, neutral palette", "Appearance > Global Styles", "Set button, link, text, background, header, footer colors.", "Design", "Open"],
  ["Header", "Primary navigation", "Appearance > Styles > Headers", "Configure custom header and menu links for public/internal shared use.", "SF Admin", "Open"],
  ["Footer", "Footer link groups", "Appearance > Styles > Footers", "Configure footer columns, social links, corporate site links.", "SF Admin", "Open"],
  ["Search", "Keyword/location/search grid", "Appearance > Global > Search / Search Grid", "Confirm keyword, location, radius, filters, labels, and job alert behavior.", "SF Admin", "Open"],
  ["SEO", "Page titles and metadata", "Settings > Site Configuration > SEO Settings", "Map prototype titles/descriptions; avoid duplicate and temporary pages.", "Marketing + SF Admin", "Open"],
  ["Analytics", "GTM/GA/source tracking", "Settings / Tools > Site Source Editor", "Confirm source tracker and campaign URL needs.", "Marketing + SF Admin", "Open"],
  ["Data Privacy", "Consent and retention text", "Settings > Data Privacy & Security", "Confirm candidate consent, privacy policy links, and report needs.", "Legal + HR", "Open"],
  ["Import/Export", "Stage-to-production process", "Tools > Import & Export", "Export Site Settings, CSB Settings, Category Pages; document import sequence.", "SF Admin", "Open"],
];
writeTable(settings, "A4", ["Area", "Setting", "CSB Path", "Decision / Action", "Owner", "Status"], settingRows, "GlobalSettings");
settings.freezePanes.freezeRows(4);
setWidths(settings, [130, 220, 260, 450, 160, 110]);

const assets = workbook.worksheets.add("Assets & Media");
setTitle(assets, "Assets & Media Register", "Upload-ready asset list for CSB image/font libraries.");
const assetRows = [
  ["Logo", "Arabian Drilling logo", "Header/Footer", "CSB image library", "SVG/PNG", "Confirm final approved file", "High"],
  ["Favicon", "Corporate favicon from arabdrill.com", "Browser tab", "CSB/site settings if supported", "ICO/PNG", "Already requested to store from corporate site; validate final format", "High"],
  ["Home hero", "Candidate/corporate drilling image", "Home Page", "Large Image", "1200px+ wide", "Use optimized image with safe focal point", "High"],
  ["Page hero images", "Unique images per content page", "Content/category pages", "Large Image", "Desktop/tablet/mobile variants", "Use CSB image recommendations and focal point settings", "High"],
  ["Big line icons", "Corporate-style drilling/people/safety icons", "Proof sections/cards", "Image library or inline plugin assets", "PNG/SVG", "Prefer uploaded images referenced by URL in plugin", "Medium"],
  ["Employee portraits", "Story cards/pages", "Employee stories", "Image library", "Square/cropped portrait", "Need real approved photos or placeholders clearly marked", "Medium"],
  ["Counter background", "Careers-at-a-glance image", "Home proof section", "Custom Plugin", "Optimized JPG/PNG", "Avoid text baked into image", "Medium"],
  ["Font files", "Certo Sans or approved substitute", "Global styles", "Font upload", "WOFF/WOFF2 if supported", "Confirm licensing and CSB support", "High"],
];
writeTable(assets, "A4", ["Asset Type", "Asset / Description", "Usage", "CSB Upload Target", "Format / Size", "Action", "Priority"], assetRows, "AssetsMedia");
assets.freezePanes.freezeRows(4);
setWidths(assets, [150, 260, 220, 220, 190, 380, 90]);

const plugins = workbook.worksheets.add("Custom Plugin Register");
setTitle(plugins, "Custom Plugin Register", "Controlled list of areas where custom HTML/CSS may be justified.");
const pluginRows = [
  ["CP-001", "Careers counter section", "index.html", "Candidate-focused counters with overlapping visual composition", "Home page brand impact", "No third-party JS; CSS scoped under .ad-csb-counter-plugin", "Medium", "Proposed"],
  ["CP-002", "Employee story gallery", "employee-stories.html", "Grouped gallery cards with links to story pages", "Native component may be too rigid", "Static HTML/CSS only if possible", "Medium", "Proposed"],
  ["CP-003", "Individual employee story Q&A", "story-*.html", "Bio panel plus FAQ-style Q&A", "Reusable narrative template", "Use semantic details/summary; no external libraries", "Medium", "Proposed"],
  ["CP-004", "Career proof icon lockup", "selected content pages", "Large corporate-style icon + metric/proof statement", "Exact brand pattern", "Can downgrade to Text component if CSB styling is acceptable", "Low", "Optional"],
  ["CP-005", "Advanced card hover states", "job-areas/function pages", "Gold/dark hover behavior from prototype", "CSB component styling limits", "Do not override native search/job results hover behavior", "Low", "Optional"],
];
writeTable(plugins, "A4", ["Plugin ID", "Plugin / Pattern", "Prototype Source", "Purpose", "Why Native May Not Fit", "Guardrails", "Risk", "Status"], pluginRows, "CustomPluginRegister");
plugins.freezePanes.freezeRows(4);
setWidths(plugins, [90, 230, 210, 320, 300, 360, 90, 110]);

const admin = workbook.worksheets.add("Admin Configuration");
setTitle(admin, "Admin Configuration Checklist", "Sequence for the SF admin or implementation partner.");
const adminRows = [
  ["Permissions", "Confirm CSB users and roles", "Admin Center / Users > Roles", "Manage Career Site Builder, Recruiter RMK SSO Permission", "Must have before build", "Open"],
  ["Baseline Export", "Export current Stage config", "Tools > Import & Export", "Site Settings, CSB Settings, Category Pages, Images/Fonts if available", "Rollback and comparison", "Open"],
  ["Brand Setup", "Configure AD brand", "Tools > Brand Management", "Logo, colors, fonts, header/footer assignment", "Global styling", "Open"],
  ["Header/Footer", "Build shared shell", "Appearance > Styles", "Header menus, footer columns, social links", "All pages", "Open"],
  ["Home Page", "Configure homepage", "Pages > Home", "Hero/search, proof sections, talent community, featured jobs", "Priority launch page", "Open"],
  ["Content Pages", "Create content pages", "Pages > Content", "About, Life at AD, Benefits, Learning, Safety, Stories", "Candidate education", "Open"],
  ["Category Pages", "Create job family pages", "Pages > Category", "Onshore, Offshore, HSE, Maintenance, Supply Chain, Corporate, Entry Level", "Job discovery", "Open"],
  ["Job Layout", "Configure job detail layout", "Layouts > Job", "Tokens, apply CTA, details, related/featured jobs", "Critical application journey", "Open"],
  ["Talent Community", "Configure data capture/profile flow", "Pages / Talent Community", "Fields, labels, consent, job alerts", "CRM capture", "Open"],
  ["QA", "Run test journeys", "Stage site", "Search, apply, create account, login, save job, join talent community", "Go/no-go", "Open"],
  ["Production Import", "Move approved build", "Tools > Import & Export", "Import XML package and smoke test", "Launch", "Open"],
];
writeTable(admin, "A4", ["Step", "Task", "CSB/Admin Path", "Configuration Detail", "Why It Matters", "Status"], adminRows, "AdminConfigChecklist");
admin.freezePanes.freezeRows(4);
setWidths(admin, [160, 230, 230, 420, 250, 110]);

const qa = workbook.worksheets.add("QA Launch Checklist");
setTitle(qa, "QA and Launch Checklist", "Use this during Stage QA and production smoke testing.");
const qaRows = [
  ["Visual", "Header/footer match approved design", "Desktop/tablet/mobile", "No clipping, broken menus, or unreadable hover states", "UX", "Open"],
  ["Visual", "Hero images and focal points", "All page types", "Text remains readable over image overlays", "UX", "Open"],
  ["Accessibility", "Contrast", "All custom sections and buttons", "No dark text on dark background; visible focus states", "UX/IT", "Open"],
  ["Accessibility", "Form labels", "Talent Community, login, apply", "Every input has visible/accessible label", "HRIS", "Open"],
  ["Search", "Keyword and location search", "Home and jobs pages", "Search returns correct jobs and empty states", "HRIS", "Open"],
  ["Job Detail", "Dynamic job fields", "Job layout", "Title, location, requisition ID, department, apply link populate from SF", "HRIS", "Open"],
  ["Apply", "Candidate application flow", "Apply pages", "Candidate can complete and submit test application", "Recruiting", "Open"],
  ["Talent Community", "Create account and alerts", "Talent Community", "Profile, consent, email notifications behave as expected", "Recruiting", "Open"],
  ["Tracking", "Source and campaign tracking", "Inbound links", "UTM/source parameters persist as expected", "Marketing", "Open"],
  ["SEO", "Metadata and index rules", "Content/category pages", "Titles, descriptions, noindex rules correct", "Marketing", "Open"],
  ["Performance", "Page load and media size", "Home/content pages", "Images optimized; no heavy plugin scripts", "IT", "Open"],
  ["Production", "Smoke test after import", "Production", "Top journeys pass after launch", "All", "Open"],
];
writeTable(qa, "A4", ["Area", "Check", "Scope", "Acceptance Criteria", "Owner", "Status"], qaRows, "QALaunchChecklist");
qa.freezePanes.freezeRows(4);
setWidths(qa, [130, 240, 220, 420, 130, 110]);

const classes = workbook.worksheets.add("SF Class Compatibility");
setTitle(classes, "SuccessFactors Class / ID Compatibility", "Key hooks observed on the live Arabian Drilling SF careers site.");
const classRows = [
  ["body.coreCSB", "All CSB pages", "Body shell class", "Already mirrored in prototype", "Keep for CSS compatibility reference only"],
  ["#header.header.headermain.navbar.navbar-default.navbar-fixed-top", "Header", "CSB header wrapper", "Already mirrored in prototype", "Configure via CSB header editor"],
  ["#content.content[role='main']", "Main content", "Primary page content container", "Already mirrored in prototype", "Do not override native layout aggressively"],
  ["#footer.footer.footerRow", "Footer", "CSB footer wrapper", "Already mirrored in prototype", "Configure footer in CSB"],
  [".keywordsearch-q / #q", "Search inputs", "Keyword search field", "Already mirrored in prototype", "Use native search form"],
  [".keywordsearch-button", "Search CTA", "Search submit button", "Already mirrored in prototype", "Style through CSB/global button settings first"],
  [".searchResultsShell / #searchresults", "Search results", "Job results shell", "Already mirrored in prototype", "Avoid custom result rendering unless required"],
  [".jobTitle / .jobTitle-link", "Search results", "Job title and link", "Already mirrored in prototype", "Native result styles should remain stable"],
  [".tcjoin / .join-form", "Talent community", "Join Talent Community component", "Observed live", "Use native component when possible"],
  [".featuredjobs", "Home/category", "Featured jobs component", "Observed live", "Use live job data rather than static cards"],
  [".threeimagecaption", "Home/content", "Three image caption component", "Observed live", "Useful for simple job family/culture cards"],
];
writeTable(classes, "A4", ["Hook", "Area", "Purpose", "Prototype Status", "Migration Guidance"], classRows, "SFClassCompatibility");
classes.freezePanes.freezeRows(4);
setWidths(classes, [330, 180, 240, 210, 390]);

const sources = workbook.worksheets.add("Source Notes");
setTitle(sources, "Source Notes", "Research references used to shape this workbook.");
const sourceRows = [
  ["SAP Help", "Creating a Career Site with Career Site Builder", "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/configure-career-sites-using-career-site-builder", "CSB controls global styles, settings, search, pages, category pages, brands/locales."],
  ["SAP Help", "Page Types in Career Site Builder", "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/pages-in-career-site-builder", "Home, content, category and landing pages are configured with components."],
  ["SAP Help", "Custom Plugin Component Settings", "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/custom-plugin-component-settings-in-career-site-builder", "Custom plugins support HTML/JS/widgets but carry risk and a 2 MB limit."],
  ["SAP Help", "Job Layout Settings", "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/job-layout-settings-in-career-site-builder-layouts", "Job layouts support columns and components such as Job Token, Text, Large Image, Video, Featured Jobs, Custom Plugin."],
  ["SAP Help", "Import & Export Settings", "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/import-export-settings-in-career-site-builder-tools", "CSB exports/imports settings and category pages for Stage-to-Production moves."],
  ["Live Site", "Arabian Drilling SF Careers", "https://jobs.arabdrill.com/", "Live reference for CSB classes, current content, navigation, and component behavior."],
  ["Local Prototype", "AD Careers Prototype", root, "Current working design and page hierarchy."],
];
writeTable(sources, "A4", ["Source Type", "Source", "URL / Path", "Used For"], sourceRows, "SourceNotes");
sources.freezePanes.freezeRows(4);
setWidths(sources, [120, 260, 600, 420]);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  if (used) {
    used.format.verticalAlignment = "Top";
  }
}

await fs.mkdir(outputDir, { recursive: true });
const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 5000,
  tableMaxRows: 3,
  tableMaxCols: 6,
});
console.log(inspect.ndjson);

for (const sheetName of ["Executive Summary", "Page Migration Map", "Section Component Map", "QA Launch Checklist"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const previewBytes = new Uint8Array(await preview.arrayBuffer());
  await fs.writeFile(path.join(outputDir, `${sheetName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`), previewBytes);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`Saved ${outputPath}`);
