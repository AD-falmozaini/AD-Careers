# Current CSB Export Findings

Source files supplied on 2026-05-15:

- `C:\Users\Admin\Downloads\SiteBuilderExport2026-05-15-05_32_49.xml`
- `C:\Users\Admin\Downloads\SiteExport_27201_2026-05-15-05_32_32.xml`
- `C:\Users\Admin\Downloads\CategoryExport (3).xml`

## What Each Export Contains

| Export | Root Element | Main Use |
|---|---|---|
| `SiteBuilderExport2026-05-15-05_32_49.xml` | `siteBuilderExport` | CSB page/component configuration, brand data, images, colors, component lists, home/content pages |
| `SiteExport_27201_2026-05-15-05_32_32.xml` | `siteXML` | Core site settings, site ID, locales, general platform settings |
| `CategoryExport (3).xml` | `categories` | Category pages, category SEO metadata, page builder properties, category search grid configuration |

## Confirmed Site Facts

- Site ID: `27201`
- Default locale: `en_US`
- Additional locale: `en_GB`
- Default brand: `default`
- Talent Community SSL is enabled.
- Bootstrap V3 responsive setup is enabled.
- Category maximum appears configured as `10`.
- Category grouping appears disabled.
- Site Builder export includes:
  - Home pages for `en_US` and `en_GB`
  - A content page named `location`
  - Image library references
  - Color IDs
  - Custom font IDs
  - Component lists
- Category export includes existing category pages such as:
  - Administrative Jobs
  - All Jobs at Arabian Drilling
  - Offshore Drilling Jobs
  - Land Drilling Jobs

## Existing CSB Patterns To Reuse

The existing category pages already use a practical structure:

1. `twocolumn` component for the category intro/hero content.
2. `categorySearchGrid` component for live job listings.

This is important because it confirms our migration should not create static job lists for category pages. We should keep live CSB job components and rebuild the surrounding page content.

## Design Migration Implications

### Home Page

The current home page uses a two-column component and existing marketing copy such as:

- `Driving Value`
- `Delivering Excellence`
- `Strive for Excellence`
- `Embracing Diversity`

The new careers design can replace or extend these sections, but the migration should preserve the existing working home/search structure until the redesigned home is built in Stage.

### Category Pages

The current category pages are the best starting point for our redesigned career family pages.

Recommended approach:

- Keep the category page record and URL where possible.
- Replace the intro `twocolumn` content with the new career-area content.
- Keep or reconfigure `categorySearchGrid`.
- Update SEO title, description, and metadata.
- Add new content sections only if supported cleanly by CSB native components or approved Custom Plugin sections.

### Locales

Both `en_US` and `en_GB` exist. The migration must decide whether both locales receive the redesigned content at launch.

Decision needed:

- Build both locales now.
- Or build only the default locale first and keep the second locale aligned later.

### Brand

Only the `default` brand is visible in the export. The redesign should therefore target the default brand unless Arabian Drilling plans to introduce a separate brand variant.

### Images, Colors, And Fonts

The export includes many image references and custom color/font IDs. We should avoid deleting these until we confirm which are actively used by the current pages.

Recommended approach:

- Build new assets in Stage.
- Keep old assets during implementation.
- Clean up unused images only after launch.

## Recommended Next Actions

1. Back up these three export files in the project as the current CSB baseline.
2. Create a page-by-page comparison between:
   - current CSB pages/categories, and
   - our prototype page migration map.
3. Prioritize redesign of existing CSB records before creating net-new pages.
4. Rebuild category pages by reusing their current `categorySearchGrid`.
5. Decide how to handle the `en_GB` locale before content entry starts.
6. Update the migration workbook with:
   - actual site ID,
   - actual locales,
   - current category names,
   - current component pattern,
   - current export file names.

