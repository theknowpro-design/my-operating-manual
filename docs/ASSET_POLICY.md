# My Operating Manual - Asset Policy

## Overview

The Asset Policy defines what media files are permitted in the My Operating Manual system. It prevents contamination from legacy Money Maker App assets and enforces strict hygiene across the codebase and production builds.

## Asset Whitelist

### Approved Assets

Only these assets may be used:

| Asset | Location | Purpose | Reason |
|-------|----------|---------|--------|
| `Teal Read Me Logo.png` | `src/assets/`, `modules/pdf-engine/assets/` | PDF branding | Official logo |
| `hero.png` | `src/assets/` | Landing page | Optional hero image |
| `react.svg` | `src/assets/` | Landing page | Framework credit |
| `vite.svg` | `src/assets/` | Landing page | Build tool credit |
| `favicon.svg` | `public/` | Browser tab | App icon |
| `icons.svg` | `public/` | Icon sprite | UI icons |

### Total Approved Count
**6 approved assets**

### Asset Categories

**Category: Branding (1)**
- Teal Read Me Logo.png — Logo used in PDFs and throughout app

**Category: Landing Page (3)**
- hero.png — Hero/banner image
- react.svg — Framework attribution
- vite.svg — Build tool attribution

**Category: App UI (2)**
- favicon.svg — Browser tab icon
- icons.svg — Icon sprite for buttons, decorations

## Non-Approved Assets

### Explicitly Rejected

These patterns are **never** approved:

**Money Maker App:**
- `*income*.png`, `*income*.jpg` — Income graphs
- `*monthly*.png`, `*monthly*.jpg` — Monthly progress
- `*niche*.png`, `*niche*.jpg` — Niche graphs
- `*cockpit*.*` — Cockpit views
- `*profit*.png`, `*profit*.jpg` — Profit visualizations
- `*money-maker*.*` — Money Maker branding

**Deprecated Systems:**
- Anything with "money maker" in filename
- Anything with "profit engine" in filename
- Previous branding assets from old projects

**Generic/Unknown:**
- Any PNG, JPG, GIF, WebP not on whitelist
- Any undocumented assets
- Any unnamed or temporary files

## Scanning & Validation

### Validator Script

**File:** `scripts/validateAssets.js`

**Purpose:** Scan asset directories and report violations.

**Usage:**
```bash
# Standard scan
node scripts/validateAssets.js

# Verbose output (show all assets)
node scripts/validateAssets.js --verbose

# Strict mode (fail if violations)
node scripts/validateAssets.js --strict

# Quiet mode (violations only)
node scripts/validateAssets.js --quiet
```

**Scanned Directories:**
- `public/` — Static public assets
- `public/assets/` — Public asset subdirectory
- `src/assets/` — React/Vite source assets
- `modules/pdf-engine/assets/` — PDF engine assets

**Output:**
```
[INFO] 🔍 Asset Validator
[INFO] Checking 4 asset directories...

[SUCCESS] ✓ public/favicon.svg
[SUCCESS] ✓ src/assets/Teal Read Me Logo.png
[WARN] ✗ NOT WHITELISTED: src/assets/old-logo.png
[ERROR] ✗ LEGACY MONEY MAKER: src/assets/income-graph.png

[INFO] 📊 Results:
[INFO]   Checked: 7 files
[INFO]   Whitelisted: 5 files
[INFO]   Violations: 2
```

### Asset Whitelist Module

**File:** `modules/pdf-engine/validators/assetWhitelist.js`

**Functions:**
- `isWhitelistedAsset(filename)` — Check if approved
- `validatePdfAsset(logoUrl)` — Validate PDF assets
- `isLegacyMoneyMakerAsset(filename)` — Detect Money Maker files
- `getAssetRejectionReason(filename)` — Explain rejection
- `getApprovedAssets()` — List all approved

## Cleanup Rules

### When to Clean Up

**Trigger 1: Build Time**
- Before running `npm run build`
- Verify no contaminated assets in bundle

**Trigger 2: Manual Review**
- Periodically audit asset directories
- Check for unauthorized files

**Trigger 3: CI/CD Check**
- Asset validator runs in build pipeline
- Fails build if violations found

### How to Clean Up

**Step 1: Identify**
```bash
node scripts/validateAssets.js
# Lists all violations
```

**Step 2: Review**
- Decide if each file should be kept or deleted
- Check git history if unsure about file purpose

**Step 3: Delete**
```bash
# Manually delete unwanted files
rm src/assets/old-logo.png
rm src/assets/income-graph.png
```

**Step 4: Verify**
```bash
node scripts/validateAssets.js --strict
# Should show: ✓ All assets are whitelisted
# Exit code 0 = success, 1 = failures
```

**Step 5: Commit**
```bash
git add -A
git commit -m "Clean up unauthorized assets"
```

## Build Hygiene

### Build-Time Checks

The build process includes multiple protection layers:

**1. Graph Recreation Guard**
```bash
npm run build
# Runs: node scripts/guards/preventGraphRecreation.js
# Checks for deprecated imports and graph folders
```

**2. Asset Validation (Optional)**
Can be added to build script:
```json
{
  "scripts": {
    "build": "node scripts/validateAssets.js --strict && node scripts/guards/preventGraphRecreation.js && vite build"
  }
}
```

**3. Vite Build**
```bash
# Vite bundles only referenced assets
# Unreferenced assets NOT included in production
```

### What Gets Bundled

**Bundled:**
- Assets imported in code
- Assets in `public/` (copied directly)
- Approved assets only

**NOT Bundled:**
- Unreferenced assets in `src/assets/`
- Deleted assets
- Assets outside public/src/modules

## Asset Addition Process

### To Add a New Approved Asset

**Step 1: Proposal**
- Document why asset is needed
- Confirm it's not Money Maker-related
- Get approval from maintainer

**Step 2: Update Whitelist**
Edit `modules/pdf-engine/validators/assetWhitelist.js`:
```javascript
const APPROVED_ASSETS = new Set([
  'Teal Read Me Logo.png',
  'hero.png',
  'react.svg',
  'vite.svg',
  'favicon.svg',
  'icons.svg',
  'new-asset.png',  // ← Add here
])
```

**Step 3: Place Asset**
Create asset in appropriate directory:
- `public/` — Static files (served as-is)
- `src/assets/` — Vite-processed files (via import)
- `modules/pdf-engine/assets/` — PDF engine assets

**Step 4: Reference in Code**
```javascript
// Import in React
import newAsset from '../assets/new-asset.png'

// Or use in CSS
background-image: url('/assets/new-asset.png')
```

**Step 5: Verify**
```bash
node scripts/validateAssets.js --verbose
# Should show: ✓ new-asset.png as whitelisted
```

**Step 6: Test**
- Dev server: `npm run dev`
- Verify asset appears correctly
- Check browser dev tools for 404s

**Step 7: Commit**
```bash
git add modules/pdf-engine/validators/assetWhitelist.js src/assets/new-asset.png
git commit -m "Add new-asset.png to approved whitelist"
```

## Protection Against Contamination

### Money Maker Detection

The validator specifically detects Money Maker asset patterns:

```javascript
const legacyPatterns = [
  /income.*graph/i,      // income-graph, income_graph, etc.
  /monthly.*progress/i,  // monthly-progress, monthly_progress, etc.
  /niche.*graph/i,       // niche-graph, niche_graph, etc.
  /cockpit/i,            // cockpit, Cockpit, etc.
  /profit.*engine/i,     // profit-engine, profit_engine, etc.
  /money.*maker/i,       // money-maker, money_maker, etc.
]
```

**If Detected:**
```
[ERROR] ✗ LEGACY MONEY MAKER: src/assets/income-graph-2026.png
```

Action: Delete immediately, do not add to whitelist.

### Prevention Strategy

| Layer | Mechanism | Prevention |
|-------|-----------|-----------|
| Policy | Explicit whitelist | Only approved files |
| Validation | Asset scanner | Detect violations |
| Build Guard | Graph recreation guard | Prevent Money Maker imports |
| PDF Engine | Asset validation | Reject bad logos |
| CI/CD | Strict mode check | Fail build on violations |

## Directory Structure

```
my-operating-manual/
├── public/                                   ← Static assets (copied to dist/)
│   ├── favicon.svg                          ✓ Approved
│   ├── icons.svg                            ✓ Approved
│   └── assets/                              ← Optional
│
├── src/
│   ├── assets/                              ← Vite-processed assets
│   │   ├── Teal Read Me Logo.png           ✓ Approved
│   │   ├── hero.png                        ✓ Approved
│   │   ├── react.svg                       ✓ Approved
│   │   └── vite.svg                        ✓ Approved
│   ├── components/
│   ├── pages/
│   └── utils/
│
├── modules/
│   └── pdf-engine/
│       └── assets/
│           └── Teal Read Me Logo.png       ✓ Approved (duplicate OK)
│
└── dist/                                    ← Production build output
    └── assets/                              ← Built assets (post-Vite)
```

## Edge Cases

### Case 1: Asset Used in Multiple Places

If the same asset is needed in multiple locations:

**Option A: Reference Once**
```javascript
// Place in public/assets/
// Reference from anywhere: <img src="/assets/logo.png" />
```

**Option B: Duplicate**
```javascript
// Place in both src/assets/ and modules/pdf-engine/assets/
// Import separately in each module
// Both must be on whitelist (same filename OK)
```

### Case 2: Vite Query Parameters

Asset imports may have Vite query parameters:
```javascript
import logo from './assets/logo.png?url'  // ?url query
```

The validator handles this:
```javascript
// Extract filename from URL
const url = '/assets/logo.png?url'
const filename = url.split('?')[0].split('/').pop()  // → 'logo.png'
// Check whitelist with just filename
isWhitelistedAsset('logo.png')  // ✓ Approved
```

### Case 3: Asset with Special Characters

Filenames with spaces or special characters:
```
Teal Read Me Logo.png  ← Spaces OK (URL-encoded as %20)
```

The validator handles spaces:
```javascript
const filename = 'Teal Read Me Logo.png'
isWhitelistedAsset(filename)  // ✓ Approved
```

## Monitoring & Auditing

### Regular Audits

**Quarterly:**
```bash
node scripts/validateAssets.js --verbose > assets-audit.log
# Review log for unexpected files
# Commit audit log to git
```

**Before Major Releases:**
```bash
node scripts/validateAssets.js --strict
# Must pass with exit code 0
```

### Metrics

Track over time:
- Total approved assets
- Build size trends
- Violation history
- Cleanup frequency

## Testing

### Test Valid Asset

```bash
touch src/assets/test-logo.svg
# Add to whitelist
# Validate
node scripts/validateAssets.js
# Should show: ✗ NOT WHITELISTED (not in whitelist yet)

# Then add to whitelist, validate again
# Should show: ✓ test-logo.svg
```

### Test Invalid Asset

```bash
touch src/assets/income-graph.png
node scripts/validateAssets.js
# Should show: ✗ LEGACY MONEY MAKER: src/assets/income-graph.png

# DO NOT add to whitelist
# Delete instead
rm src/assets/income-graph.png
```

### Test Strict Mode

```bash
touch src/assets/bad.jpg
node scripts/validateAssets.js --strict
# Exit code: 1 (failure)

rm src/assets/bad.jpg
node scripts/validateAssets.js --strict
# Exit code: 0 (success)
```

## References

- **Asset Whitelist Module:** `modules/pdf-engine/validators/assetWhitelist.js`
- **Validator Script:** `scripts/validateAssets.js`
- **Branding Config:** `modules/pdf-engine/brandingConfig.js`
- **Build Guard:** `scripts/guards/preventGraphRecreation.js`
- **Asset Whitelist Guide:** `ASSET_WHITELIST.md`
