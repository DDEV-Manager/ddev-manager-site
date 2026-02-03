# DDEV Manager Website

Marketing website for DDEV Manager, built with Astro and Tailwind CSS.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Dynamic Release Data**: Fetches latest release info from GitHub API at build time
- **Platform Detection**: Automatically highlights download for visitor's OS
- **Contributors Section**: Shows GitHub contributors fetched at build time
- **Dark/Light Mode**: Respects system preference with manual toggle
- **Responsive Design**: Works on all screen sizes

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions:

- On push to `main` branch
- On `repository_dispatch` event (triggered by main repo on release)
- Manually via `workflow_dispatch`

### Setup for Auto-rebuild on Release

To automatically rebuild the website when a new release is published:

1. Create a Personal Access Token (PAT) with `repo` scope
2. Add it as `WEBSITE_DEPLOY_TOKEN` secret in the main `ddev-manager` repo
3. Add the following job to `.github/workflows/release.yml`:

```yaml
trigger-website-rebuild:
  runs-on: ubuntu-latest
  needs: [publish]
  steps:
    - name: Trigger website rebuild
      uses: peter-evans/repository-dispatch@v3
      with:
        token: ${{ secrets.WEBSITE_DEPLOY_TOKEN }}
        repository: DDEV-Manager/ddev-manager-site
        event-type: release-published
```

## Project Structure

```
website/
├── src/
│   ├── components/       # Astro components
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Downloads.astro
│   │   ├── Contributors.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── github.ts     # GitHub API utilities
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── public/
│   └── images/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Framework**: [Astro 5.x](https://astro.build)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com)
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions
