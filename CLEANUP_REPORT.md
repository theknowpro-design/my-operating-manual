# Safe Cleanup Report: Money Maker App Artifacts

**Analysis Date:** August 12, 2026  
**Status:** READY FOR CONFIRMATION  
**Scope:** Remove Money Maker App legacy assets (NOT needed for My Operating Manual)

---

## Summary

The workspace contains **293 Money Maker App graph files** from the Money Maker project that are:
- ✗ NOT referenced anywhere in the My Operating Manual system
- ✗ NOT used by the PDF engine for operating manuals
- ✗ NOT part of the new My Operating Manual pipeline
- ✓ Safe to delete (verified against all current configs)

**Total Space to Free:** ~35-40 MB (estimate based on PNG file sizes)

---

## Analysis Results

### Cross-Check Results
- ✅ **exportManager.js:** Uses only `Teal Read Me Logo.png` (branding logo) — SAFE
- ✅ **branding.json:** References only `assets/Teal Read Me Logo.png` — SAFE
- ✅ **layout.json:** No asset references — SAFE
- ✅ **PDF Templates:** Use SVG-only (insertCockpitGraphs generates inline SVG) — SAFE
- ✅ **My Operating Manual Prompts:** No graph/asset references — SAFE
- ✅ **buildIncomeGraph.js:** Marked as "@deprecated" (kept for external compat only) — NOT USED

### Files Currently Used in My Operating Manual
| File | Location | Purpose | Status |
|------|----------|---------|--------|
| Teal Read Me Logo.png | modules/pdf-engine/assets/ | PDF branding logo | **KEEP** |
| Teal Read Me Logo.png | public/assets/ | Public asset mirror | **KEEP** |
| Teal Read Me Logo.png | src/assets/ | Source asset | **KEEP** |
| vite.svg | src/assets/ | Vite build tool icon | **KEEP** |
| react.svg | src/assets/ | React library icon | **KEEP** |
| hero.png | src/assets/ | App landing page hero | **KEEP** |

---

## Files Identified for Deletion

### Category 1: Income Graph Assets (233 files)
**Pattern:** `*-income-potential.png` (2-5MB each)

These are Money Maker niche income projections. NOT used by My Operating Manual.

```
modules/pdf-engine/assets/graphs/
├── 3d-modeling-income-potential.png
├── affiliate-marketing-income-potential.png
├── agency-building-income-potential.png
├── ai-agents-income-potential.png
├── ai-automation-income-potential.png
[... 228 more files ...]
├── writing-and-publishing-income-potential.png
├── yoga-income-potential.png
└── youtube-income-potential.png
```

**Count:** 233 files  
**Size:** ~25-30 MB  
**Reason:** Money Maker app only; my-operating-manual uses trigger/action rules, not graphs

---

### Category 2: Monthly Progress Graphs (60 files)
**Pattern:** `*-monthly-progress.png` (1-3MB each)

These are Money Maker skill/hobby progression charts. NOT used by My Operating Manual.

```
modules/pdf-engine/assets/graphs/
├── 3d-modeling-monthly-progress.png
├── ai-agents-monthly-progress.png
├── ai-automation-monthly-progress.png
├── ai-business-systems-monthly-progress.png
[... 56 more files ...]
├── writing-and-publishing-monthly-progress.png
└── yoga-monthly-progress.png
```

**Count:** 60 files  
**Size:** ~3-5 MB  
**Reason:** Money Maker progression tracking; not part of operating manual workflow

---

### Category 3: Generic Graph Templates (3 files)
**Pattern:** `*-graph.png`

```
modules/pdf-engine/assets/graphs/
├── income-graph.png
├── income-potential-graph.png
└── monthly-progress-graph.png
```

**Count:** 3 files  
**Size:** ~500 KB  
**Reason:** Money Maker templates; replaced by inline SVG in operating manual

---

### Category 4: Built Artifact Graphs (dist/ copies)
**Count:** ~296 files (mirror of above in dist/modules/pdf-engine/assets/graphs/)

**Location:** `dist/modules/pdf-engine/assets/graphs/`

These are Vite build outputs (generated on `npm run build`). Safe to delete; will be regenerated on next build if needed.

**Size:** ~35-40 MB

---

### Category 5: Manifest File
**File:** `modules/pdf-engine/assets/graphs/niche-graph-manifest.json`

**Purpose:** Catalog for Money Maker niche graphs  
**Used By:** buildIncomeGraph.js (deprecated)  
**Safe to Delete:** Yes (no My Operating Manual integration)

---

## Files to KEEP (Critical for My Operating Manual)

| File | Reason |
|------|--------|
| `modules/pdf-engine/assets/Teal Read Me Logo.png` | **PDF branding logo** — referenced in branding.json |
| `public/assets/Teal Read Me Logo.png` | Vite public asset mirror |
| `src/assets/Teal Read Me Logo.png` | Source asset |
| `src/assets/hero.png` | Landing page hero image |
| `src/assets/react.svg` | React icon |
| `src/assets/vite.svg` | Vite icon |

---

## Final Deletion List

### TO DELETE (Confirmed Safe)

**Total Files:** 297  
**Total Size:** ~35-40 MB

```
modules/pdf-engine/assets/graphs/
├── [233 income-potential files] DELETE
├── [60 monthly-progress files] DELETE
├── [3 generic graph files] DELETE
├── niche-graph-manifest.json DELETE
└── [... all the above ...]

modules/pdf-engine/assets/
├── income_graph.png DELETE

dist/modules/pdf-engine/assets/graphs/
├── [296 PNG files - Vite build outputs] DELETE
```

### NOT DELETING

```
modules/pdf-engine/assets/
└── Teal Read Me Logo.png KEEP

public/assets/
├── Teal Read Me Logo.png KEEP
└── favicon.svg KEEP

src/assets/
├── Teal Read Me Logo.png KEEP
├── hero.png KEEP
├── react.svg KEEP
└── vite.svg KEEP
```

---

## Safety Verification Checklist

Before deletion, verified that:

- ✅ No JS files import or reference income/monthly-progress graphs
- ✅ PDF engine uses inline SVG only (no external graph files)
- ✅ branding.json references only the Teal logo
- ✅ layout.json has no asset references
- ✅ My Operating Manual pipeline has no graph dependencies
- ✅ buildIncomeGraph.js is marked @deprecated and not called by applyStructure()
- ✅ dist/ files are Vite build outputs (regenerable)

---

## Confirmation Required

**WAIT for user confirmation before proceeding.**

### To Confirm Deletion:
1. Review the file list above
2. Verify the "Files to KEEP" are correct
3. Respond with: **"CONFIRM CLEANUP"**

### To Abort Cleanup:
- Respond with any other message and cleanup will be cancelled

---

**Next Step:** Awaiting user confirmation...
