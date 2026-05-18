# Arabian Drilling Careers - SuccessFactors CSB Migration Guide

Use this guide as the working playbook for moving the AD Careers prototype into SAP SuccessFactors Career Site Builder (CSB).

## 1. Confirm Access And Environment

Before design migration starts, confirm that the team is working in the correct SuccessFactors environment.

### Required Access

- Go to `Admin Center > Manage Permission Roles`.
- Confirm the admin user has:
  - `Manage Recruiting > Manage Career Site Builder`
  - `User Permissions > Recruiting Permissions > Recruiter RMK SSO Permission`
- Open `Admin Center > Manage Career Site Builder`.
- Confirm whether you are in Stage or Production.

### Output

- Named CSB admin users confirmed.
- Stage environment available.
- Production environment protected from direct design experiments.

## 2. Understand The Current CSB Baseline

The current exports show that Arabian Drilling already has a working CSB structure. The redesign should build on it, not replace it blindly.

### Baseline Export Files

| Export File | What It Contains | How We Use It |
|---|---|---|
| `SiteBuilderExport2026-05-15-05_32_49.xml` | CSB page/component configuration, brand data, image references, colors, fonts, home/content pages | Main reference for current CSB components and page builder structure |
| `SiteExport_27201_2026-05-15-05_32_32.xml` | Core site settings, site ID, locales, platform options | Confirms site-level settings before making changes |
| `CategoryExport (3).xml` | Category pages, SEO metadata, category page builder properties, job search grid components | Main reference for career-family/job-category page migration |

### Confirmed Baseline

- Site ID: `27201`
- Default brand: `default`
- Default locale: `en_US`
- Additional locale: `en_GB`
- Talent Community SSL is enabled.
- Bootstrap V3 responsive setup is enabled.
- Current category pages use a native `categorySearchGrid`.
- Existing category intro sections commonly use a `twocolumn` component.

### Existing Category Pages

The export confirms these existing category pages:

- Administrative Jobs
- All Jobs at Arabian Drilling
- Offshore Drilling Jobs
- Land Drilling Jobs

### Migration Decision

Use the existing CSB records where possible:

- Update existing category pages instead of creating duplicates.
- Preserve native search/job components.
- Replace old intro copy and images with the redesigned content.
- Add new pages only where there is no current CSB equivalent.
- Keep old images/colors/fonts until the new Stage build is approved.

### Output

- Baseline findings documented in `docs/csb-exports/current-export-findings.md`.
- Raw export analysis documented in `docs/csb-exports/csb-export-analysis.md`.

## 3. Export The Current CSB Baseline

Always create a baseline export before changing the site.

Current baseline files supplied on 2026-05-15:

- `SiteBuilderExport2026-05-15-05_32_49.xml`
- `SiteExport_27201_2026-05-15-05_32_32.xml`
- `CategoryExport (3).xml`

Confirmed from the exports:

- Site ID: `27201`
- Default locale: `en_US`
- Additional locale: `en_GB`
- Default brand: `default`
- Existing category pages already use `twocolumn` plus `categorySearchGrid`

### CSB Path

`Tools > Import & Export`

### Export

Export these items:

- Site Settings
- Career Site Builder Settings
- Category Pages
- Fonts and Images, if available
- Email Layouts, if in scope

### Output

- Baseline export saved with date and environment name.
- Rollback package available before redesign work begins.
- Current export findings documented in `docs/csb-exports/current-export-findings.md`.

## 4. Set The Global Brand Foundation

Configure the reusable site foundation first. Do not start page-by-page design until these are stable.

### CSB Areas

- `Tools > Brand Management`
- `Appearance > Global`
- `Appearance > Styles > Headers`
- `Appearance > Styles > Footers`
- `Settings > Site Configuration`

### Configure

- Arabian Drilling logo
- Favicon
- Brand colors:
  - Deep green
  - Orange
  - Gold
  - Neutral backgrounds
- Fonts or approved fallback fonts
- Header navigation
- Footer navigation
- Button styles
- Link styles
- Search settings
- SEO defaults

### Output

- Global brand shell approved.
- Header/footer confirmed on desktop and mobile.
- Search component visually aligned with the prototype.

## 5. Upload And Organize Assets

Prepare all media before building pages.

### Prototype Asset Package

The prototype assets have been separated into a migration-ready folder:

`outputs/csb-migration/prototype-assets`

This folder includes:

- All local assets referenced by the prototype pages and CSS
- Original relative folder structure preserved
- `asset-manifest.csv` with source page references, file extensions, file sizes, and usage context
- `README.md` explaining the package contents and upload notes

Use this folder as the staging package for CSB image/font upload. It is not intended to be the final production hosting path.

### CSB Area

Use the CSB Image Selector / Image Library wherever available.

### Upload

- Logo
- Favicon
- Home hero image
- Unique hero images for page families
- Corporate-style big icons
- Employee story portraits
- Counter/proof section imagery
- Fonts, if licensed and supported

### Rules

- Do not use Base64 images inside Custom Plugin components.
- Use uploaded image URLs for custom plugin content.
- Keep file sizes optimized.
- Confirm image rights and approvals.
- Add alt text where CSB allows it.
- If an asset is replaced by a higher-resolution or approved corporate version, update the package manifest before upload.

### Output

- Asset library ready.
- Asset names documented in the workbook.
- Migration-ready asset package preserved at `outputs/csb-migration/prototype-assets`.

## 6. Map Prototype Pages To CSB Page Types

Use the workbook tab `Page Migration Map` as the master tracker.

### Recommended Mapping

| Prototype Area | CSB Target |
|---|---|
| Home page | `Pages > Home` |
| General content pages | `Pages > Content` |
| Job family pages | `Pages > Category` when tied to live jobs |
| Job results | Native search/results page |
| Job detail | `Layouts > Job` |
| Talent Community | Native Talent Community / Data Capture Form |
| Candidate profile / sign in | Native candidate profile flow |
| Application pages | Native Recruiting Management apply flow |
| Employee stories | Content pages, with optional Custom Plugin templates |

### Output

- Every prototype page assigned to a CSB page type.
- Any page not moving to CSB marked as archive/reference only.

## 7. Build Native Components First

Use CSB native components wherever possible.

### Good Native Fits

- Large Image for hero sections
- Text for editorial sections
- Three Column Images with Caption for card groups
- Image and Text Carousel for controlled slides
- Featured Jobs for live job promotion
- Job Token for job detail fields
- Talent Community/Data Capture components for candidate CRM

### Avoid

- Rebuilding search results manually
- Rebuilding job detail data manually
- Rebuilding the apply flow manually
- Using custom JavaScript to manipulate native CSB components

### Output

- Maintainable CSB pages that can survive SAP updates.

## 8. Use Custom Plugin Only Where Needed

Custom Plugin should be controlled and limited.

### Candidate Custom Plugins

- Careers counter section
- Employee story gallery
- Individual story Q&A layout
- Corporate-style proof/icon lockups
- Advanced card layouts that native CSB cannot match

### Guardrails

- Keep each plugin under 2 MB.
- Avoid third-party libraries.
- Avoid replacing native CSB behavior.
- Scope CSS under a unique wrapper, for example:

```html
<section class="ad-csb-story-plugin">
  ...
</section>
```

```css
.ad-csb-story-plugin {
  ...
}
```

- Do not target broad selectors like `body`, `.content`, `.searchResults`, or `.jobTitle` inside plugin CSS.

### Output

- Small, isolated custom sections.
- Lower risk during SAP releases.

## 9. Build The Home Page

### CSB Path

`Pages > Home > <Locale> > <Brand>`

### Existing Baseline

The current Site Builder export includes Home pages for both `en_US` and `en_GB`.

The existing home page includes current marketing messages such as:

- `Driving Value`
- `Delivering Excellence`
- `Strive for Excellence`
- `Embracing Diversity`

The redesigned home page should replace these with the approved careers messaging while preserving native search and Talent Community behavior.

### Build Order

1. Hero image and search
2. Candidate value proposition
3. Career counters/proof section
4. Career family entry points
5. Featured jobs
6. Talent Community CTA

### QA

- Search works.
- Hero text is readable.
- CTAs link correctly.
- Mobile layout is clean.

## 10. Build Career Area And Category Pages

### CSB Path

`Pages > Category`

Use category pages when the page should show live jobs by rule.

### Priority Pages

- Onshore Drilling
- Offshore Drilling
- HSE
- Maintenance & Engineering
- Supply Chain & Logistics
- Corporate Careers
- Students & Graduates
- Entry Level

### Existing CSB Starting Point

The supplied `CategoryExport (3).xml` confirms that current category pages already exist for:

- Administrative Jobs
- All Jobs at Arabian Drilling
- Offshore Drilling Jobs
- Land Drilling Jobs

For these pages, prefer updating the existing category page records rather than creating duplicate category pages.

### Recommended Category Migration Pattern

For each existing category page:

1. Open the current category in CSB Stage.
2. Confirm the current category name, URL, SEO fields, locale, and brand.
3. Keep the native `categorySearchGrid`.
4. Replace or restyle the current `twocolumn` intro with the redesigned career-area intro.
5. Add supporting content only if it can be built with native components or an approved Custom Plugin.
6. Test that the category still returns the correct live jobs.
7. Update the workbook status.

### Mobile Header CSS Fix

The current CSB mobile header needs a custom CSS override to prevent:

- the `View Profile` row appearing as a separate mobile header line,
- the mobile search panel overlapping the hero,
- the hamburger menu opening as an unstyled dropdown,
- the old `twocolumn` home hero forcing awkward mobile spacing.

Use the prepared CSB override file:

`outputs/csb-migration/csb-mobile-menu-fix.css`

Apply it after the current CSB CSS in Stage, then test mobile widths before production.

### Configure

- Category rules
- Hero section
- Intro content
- Featured jobs or search results
- Adjacent career links
- Talent Community CTA

### QA

- Rules return the correct jobs.
- Empty category behavior is acceptable.
- Related links are correct.

## 11. Build Content Pages

### CSB Path

`Pages > Content`

### Priority Content Pages

- About AD
- Life at Arabian Drilling
- Benefits
- Learning and Development
- Safety Culture
- Hiring Process
- FAQ
- Recruiting Fraud
- Candidate Privacy
- Employee Stories
- Individual story pages

### QA

- Page title and metadata are correct.
- Navigation links work.
- Content is not duplicated.
- Mobile readability is strong.

## 12. Configure Job Detail Layout

### CSB Path

`Layouts > Job > <Locale> > <Brand> > Job Layout`

### Use Native Components

- Job Token for title
- Job Token for location
- Job Token for department
- Job Token for requisition ID
- Job Token for posting content
- Apply button
- Featured or related jobs where appropriate

### Important

Do not hardcode live job fields. The prototype job detail page is a design reference only.

### QA

- Multiple jobs render correctly.
- Requisition ID is readable.
- Apply button routes correctly.
- Mobile job detail layout is clean.

## 13. Configure Talent Community And Candidate Flows

### Use Native Flow

Talent Community, sign in, profile, saved jobs, job alerts, and application flows should remain SuccessFactors-native.

The current site export confirms Talent Community SSL is enabled. Preserve the native Talent Community flow and update labels, styling, and supporting content through CSB configuration wherever possible.

### Check

- All input fields have visible labels.
- Required fields are clear.
- Consent text is approved.
- Job alert preferences work.
- Candidate profile can be created and edited.

## 14. Run Full QA In Stage

Use the workbook tab `QA Launch Checklist`.

### Required Test Journeys

- Search for a job from the home page.
- Filter jobs by location or category.
- Open a job detail page.
- Apply to a test job.
- Save a job.
- Join Talent Community.
- Sign in to candidate profile.
- Reset password.
- Submit a Talent Community profile.
- Navigate every header and footer link.

### Visual QA

- Desktop
- Tablet
- Mobile
- Hover states
- Focus states
- Form labels
- Contrast
- Hero readability
- Image loading
- No clipped text

## 15. Prepare Production Move

### Before Import

- Confirm Stage signoff.
- Export final Stage CSB settings.
- Save final workbook status.
- Confirm production backup/export.
- Schedule launch window.

### CSB Path

`Tools > Import & Export`

### Import

Move approved XML/configuration from Stage to Production according to the implementation partner’s process.

### Warning

Do not manually change integration keys, API credentials, SSO settings, or data center settings unless the implementation partner or SAP support directs it.

## 16. Production Smoke Test

Immediately after launch:

- Home page loads.
- Header/footer render correctly.
- Search works.
- Job results load.
- Job detail loads.
- Apply works.
- Talent Community works.
- Candidate sign in works.
- Mobile navigation works.
- Analytics/source tracking still works.

## 17. Working Files

Use these as the master references:

- `outputs/csb-migration/arabian-drilling-csb-migration-workbook.xlsx`
- `outputs/csb-migration/prototype-assets`
- `outputs/csb-migration/prototype-assets/asset-manifest.csv`
- `docs/successfactors-class-inventory.md`
- `docs/content-inventory.md`
- `docs/csb-exports/current-export-findings.md`
- `docs/csb-exports/csb-export-analysis.md`
- Local prototype pages in the project root

## 18. Recommended Team Rhythm

### Daily During Build

- Review completed CSB pages.
- Update workbook build status.
- Log blockers by page/component.
- Confirm whether blockers are native-component limitations or content decisions.

### Signoff Gates

1. Global brand shell approved.
2. Home page approved.
3. Job search and job detail approved.
4. Talent Community and apply flow approved.
5. Content/category pages approved.
6. Full Stage QA approved.
7. Production smoke test approved.
