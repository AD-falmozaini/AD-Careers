# AD Careers Site

Static multi-page careers website prototype for Arabian Drilling.

## Run Locally

```powershell
npm run dev
```

Then open <http://127.0.0.1:4177>.

You can also open `index.html` directly in a browser because the site has no build step.

## GitHub Pages

This is a static site and can be published directly from the repository root on the `main` branch. The `.nojekyll` file is included so GitHub Pages serves all folders and assets without Jekyll processing.

Expected GitHub Pages URL:

<https://ad-falmozaini.github.io/AD-Careers/>

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. In GitHub, confirm `Settings > Pages > Source` is set to `GitHub Actions`.

## Project Contents

- Careers homepage
- Jobs listing
- Job detail template
- Job area hub and category pages
- Life at AD
- Students and graduates
- Hiring process
- FAQ
- Recruiting fraud
- Ethical AI
- Talent community
- Candidate profile
- Privacy
- SEO and content inventory

## Useful Commands

```powershell
npm run dev
npm run check
```

## Source

Initial prototype copied from:

`C:\Users\Admin\OneDrive - meadd.ai 1\OneDrive - Arabian Drilling\HR Transformation\Projects\Careers Website\ad-careers-prototype\ad-careers-prototype`

## Notes

- All graphics are CSS placeholders so the prototype can be shared without external assets.
- Replace placeholders with AD-approved photography, icons, and brand assets.
- Connect Jobs, Apply, Profile, and Talent Community to SuccessFactors Recruiting or the selected ATS.
