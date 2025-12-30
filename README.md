# Portfolio Albums (Vite + React)

Static React site that reads album and photo content from `public/data` and renders grayscale editorial layouts suited for GitHub Pages.

## Commands

```bash
npm install
npm run dev
npm run build
```

`npm run build` outputs to `dist/` and copies `index.html` to `404.html` for GitHub Pages routing.

## Content

- `public/data/albums.json` — list of albums ({ slug, title, posterSrc })
- `public/data/[slug].json` — album detail ({ albumTitle, blocks })
- `public/images/` — poster and photo assets referenced in the JSON

Adjust `vite.config.js` `base` if you deploy to a different repo name or custom domain.
