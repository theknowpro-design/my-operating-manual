# My Operating Manual

A guided 12-phase interview that turns how you work into a shareable personal operating manual, with light/dark UI and branded PDF export.

## Quick start

```bash
npm install
npm run dev
```

## App flow

1. **Landing** — optional name, begin interview  
2. **Guided interview** — 12 phases with optional deepening questions  
3. **Output** — markdown manual, sticky TOC, copy / print / **Export PDF**

## PDF engine

The PDF pipeline lives in `modules/pdf-engine/`. The ActionBar calls:

```js
import { generatePDF } from '../../modules/pdf-engine/exportManager.js'
await generatePDF(manualMarkdown, { title })
```

Export always runs through the light-mode pipeline (sanitize → structure → render) using templates, branding, and layout config.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
