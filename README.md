# momentsite

A lightweight marketing/demo site for Moments built with React + Vite.

This repo contains a landing page with a live "phone" demo, a morphing CTA bubble, and a nearby moments list styled for a dark theme.

## Quick start

```bash
# 1) Install deps
npm install

# 2) Run the dev server (Vite)
npm run dev
# Vite will print the local URL, e.g. http://localhost:5173 (or next free port)

# 3) Production build
npm run build

# 4) Preview the production build locally
npm run preview
```

## Scripts

- npm run dev: start Vite in development
- npm run build: build optimized production assets
- npm run preview: preview the production build locally

## Tech stack

- React 19
- Vite 7
- Vanilla CSS (no CSS framework)

## Project structure

```
.
├─ index.html             # Vite entry HTML
├─ vite.config.js         # Vite config
├─ src/
│  ├─ main.jsx            # React bootstrap
│  ├─ App.jsx             # Page + Phone demo + CTA
│  ├─ App.css             # Component + layout styles
│  └─ index.css           # Base styles/fonts
└─ package.json
```

## Customizing content

- Hero title image: update the src of .hero-logo in src/App.jsx.
- Header/phone logos: update the image URLs used for the header and phone brand in src/App.jsx.
- CTA bubble options: edit the EarlyAccessCTA component in src/App.jsx.
- Rotating profiles (name/traits/year): edit the criteriaSets array in PhoneDemo within src/App.jsx.
- Nearby moments list: edit the items array in MomentsNearby within src/App.jsx.
- Accent color: change --accent-color in :root inside src/App.css.

## Styling notes

- The site embraces a black outer canvas and a white content card. The in-phone UI uses dark bubbles with a lime accent.
- The CTA uses a "morphing bubble" animation (scale + height) to reveal two actions inside the same bubble.
- The phone demo simulates rotating matches with avatars, criteria, and a strength meter.

## Deployment

Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Build and deploy the dist/ folder.

- Netlify/Vercel: set the build command to npm run build and publish directory to dist.
- GitHub Pages: push the dist folder or enable a Pages action. If serving from a subpath, set base in vite.config.js accordingly.

## License

No explicit license provided. If you plan to open-source, add a LICENSE file (e.g., MIT).
