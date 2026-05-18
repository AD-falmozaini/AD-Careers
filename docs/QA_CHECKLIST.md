# QA Checklist

## Design System Compliance

- Uses the ADC token file through `styles.css` import.
- Uses approved fonts, logos, images, and AD Careers icon pack v4 assets only.
- No external fonts, stock images, CDN libraries, or third-party icon libraries.
- Replaces the old fake text logo with the official Arabian Drilling logo asset.
- Replaces CSS placeholder rig art with approved ADC imagery.

## Accessibility

- Each page keeps a single H1.
- Skip link is present.
- Focus outline is visible and tokenized.
- Forms use labels or aria labels.
- FAQ uses native `details` and `summary`.

## SEO

- Unique title tags and meta descriptions exist.
- Canonical URLs are present.
- JSON-LD exists in the original prototype and is preserved where available.
- Job detail includes a reusable JobPosting template note.
- SEO inventory page documents metadata and keyword clusters.

## Responsive Behavior

- Navigation simplifies on mobile.
- Search controls stack on small screens.
- Cards and job cards stack on small screens.
- Hero imagery keeps stable dimensions.

## Form Behavior

- Static forms require ATS/CRM integration.
- Search, Talent Community, Candidate Profile, Apply, Save Job, and Job Alerts are documented integration points.

## Link Checking

- Main nav, footer, CTAs, job cards, and related links use local relative links.
