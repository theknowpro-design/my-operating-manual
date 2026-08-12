# Asset Whitelist System

This document describes the strict asset whitelist system that prevents contamination from legacy Money Maker App assets or other unwanted files.

## Overview

The asset whitelist provides:

1. **Centralized whitelist** — Single source of truth for approved assets
2. **Asset validation** — Check if assets are approved before use
3. **Legacy detection** — Identify Money Maker App assets specifically
4. **Scanning script** — Automated checks across asset directories
5. **Build-time checks** — Validates assets during PDF generation
6. **Console warnings** — Clear feedback when violations occur

## Approved Assets

Only the following assets are approved for use in My Operating Manual:

### Core Branding
- `Teal Read Me Logo.png` — Official branding logo

### Landing Page (Optional)
- `hero.png` — Hero image for landing page

### Framework Credits
- `react.svg` — React framework logo
- `vite.svg` — Vite build tool logo

### App Assets
- `favicon.svg` — App favicon
- `icons.svg` — Icon sprite

All other image, video, or media files are **REJECTED**.

## Architecture

### 1. Asset Whitelist Module (`modules/pdf-engine/validators/assetWhitelist.js`)

Core validation utilities:

- **`isWhitelistedAsset(filename)`** — Check if asset is approved
  - Case-sensitive matching
  - Returns boolean

- **`getAssetRejectionReason(filename)`** — Get rejection reason
  - Returns null if whitelisted
  - Returns explanatory message if rejected

- **`validatePdfAsset(logoUrl)`** — Validate PDF asset usage
  - Extracts filename from URLs with query strings
  - Returns `{valid, reason}` object
  - Used by PDF generation

- **`isLegacyMoneyMakerAsset(filename)`** — Detect Money Maker assets
  - Pattern matching for known legacy names
  - Helps identify contaminated assets
  - Patterns: `income*graph`, `monthly*progress`, `niche*graph`, etc.

- **`getApprovedAssets()`** — Get list of approved assets
  - Returns sorted string array
  - Useful for documentation and debugging

### 2. Asset Validator Script (`scripts/validateAssets.js`)

Automated scanning and reporting:

#### Usage

```bash
# Default scan with summary
node scripts/validateAssets.js

# Verbose output showing all assets
node scripts/validateAssets.js --verbose

# Fail build if violations found
node scripts/validateAssets.js --strict

# Quiet mode, only show violations
node scripts/validateAssets.js --quiet
```

#### Scans

- `public/` — Public static assets
- `public/assets/` — Public asset subdirectory
- `src/assets/` — Source asset directory
- `modules/pdf-engine/assets/` — PDF engine assets

#### Output

Example output:

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

[ERROR] ❌ Asset validation FAILED
```

### 3. PDF Engine Integration (`modules/pdf-engine/exportManager.js`)

Asset validation during PDF generation:

```javascript
// VALIDATION: Enforce asset whitelist (prevent legacy asset contamination)
const assetValidation = validatePdfAsset(brandingConfig.logo);
if (!assetValidation.valid) {
  const error = new Error(`[PDF Assets] ${assetValidation.reason}`);
  error.code = 'ASSET_WHITELIST_VIOLATION';
  throw error;
}
```

**When validation fails:**
- Error is thrown with code `ASSET_WHITELIST_VIOLATION`
- Console error is logged
- PDF generation stops
- User sees error in UI

## Common Violations

### Adding a New Asset

To add a new approved asset:

1. **Add to whitelist** — Edit `modules/pdf-engine/validators/assetWhitelist.js`:
   ```javascript
   const APPROVED_ASSETS = new Set([
     'Teal Read Me Logo.png',
     'hero.png',
     'react.svg',
     'vite.svg',
     'favicon.svg',
     'icons.svg',
     'new-logo.png',  // ← Add here
   ])
   ```

2. **Place asset** — Put file in appropriate directory:
   - `public/` — Public static files
   - `src/assets/` — Source assets (Vite-processed)
   - `modules/pdf-engine/assets/` — PDF engine assets

3. **Verify** — Run validator:
   ```bash
   node scripts/validateAssets.js --verbose
   ```

### Removing Contaminated Assets

If legacy Money Maker assets are detected:

1. **Review** — Check the asset list and decide which to delete
2. **Delete** — Manually delete unwanted files
3. **Verify** — Run validator again:
   ```bash
   node scripts/validateAssets.js --strict
   ```

### Handling Violations

If validator reports violations:

1. **Identify** — Check which assets are flagged
2. **Decide** — Add to whitelist or delete
3. **Fix** — Update whitelist or delete files
4. **Verify** — Run validator again
5. **Commit** — Only commit after validation passes

## Error Messages

### Non-Whitelisted Asset

```
[WARN] ✗ NOT WHITELISTED: src/assets/custom-image.png
Approved assets: "Teal Read Me Logo.png", "hero.png", "react.svg", "vite.svg", "favicon.svg", "icons.svg"
```

**Fix:** Either delete the file or add it to the whitelist.

### Legacy Money Maker Asset

```
[ERROR] ✗ LEGACY MONEY MAKER: src/assets/income-graph.png
These should be manually reviewed and deleted if not needed.
```

**Fix:** Review and delete the asset. Do not add Money Maker assets to whitelist.

### Asset Validation Failed During PDF Generation

```
[ERROR] [PDF Assets] Asset "old-logo.png" is not on the approved whitelist.
```

**Fix:** Ensure only whitelisted assets are referenced in `brandingConfig.js`.

## Build Integration (Optional)

To fail builds if asset violations exist, update `package.json`:

```json
{
  "scripts": {
    "build": "node scripts/validateAssets.js --strict && node scripts/guards/preventGraphRecreation.js && vite build"
  }
}
```

This ensures no contaminated assets are included in production builds.

## Development Workflow

### Daily Development

```bash
# Check assets during development
node scripts/validateAssets.js

# Verbose output to see all assets
node scripts/validateAssets.js --verbose
```

### Before Committing

```bash
# Strict mode — fails if violations
node scripts/validateAssets.js --strict
```

### Adding Assets

1. Place new asset in `src/assets/` or appropriate directory
2. Add filename to `APPROVED_ASSETS` in `assetWhitelist.js`
3. Run `node scripts/validateAssets.js --verbose`
4. Verify new asset is shown as whitelisted
5. Commit both files

## Prevention

The asset whitelist prevents:

- ✅ Accidental inclusion of Money Maker App assets
- ✅ Legacy PNG contamination (income graphs, progress charts, etc.)
- ✅ Untracked image files in production
- ✅ Generic "any asset" policies
- ✅ Future contamination from similar systems

The whitelist **DOES NOT** prevent:

- ❌ Users from manually adding unwanted files (use manual review + deletion)
- ❌ All possible contamination vectors (use code review)
- ❌ Asset naming conflicts (use good naming conventions)

## Testing

### Simulate a Violation

Add a test file:

```bash
touch src/assets/test-image.png
node scripts/validateAssets.js
# Should show: [WARN] ✗ NOT WHITELISTED: src/assets/test-image.png

rm src/assets/test-image.png
node scripts/validateAssets.js
# Should show: [SUCCESS] ✓ All assets are whitelisted
```

### Test Legacy Detection

```bash
touch src/assets/income-graph-test.png
node scripts/validateAssets.js
# Should show: [ERROR] ✗ LEGACY MONEY MAKER: src/assets/income-graph-test.png

rm src/assets/income-graph-test.png
```

### Test Strict Mode

```bash
touch src/assets/bad-asset.png
node scripts/validateAssets.js --strict
# Should exit with code 1

node scripts/validateAssets.js --strict; echo "Exit code: $?"
# Output: Exit code: 1
```

## Future Enhancements

- [ ] Auto-delete flagged assets with `--auto-clean` flag
- [ ] Generate whitelist from directory with `--generate-from DIR`
- [ ] Scan version control history for removed assets
- [ ] Metrics dashboard of asset changes over time
- [ ] Pre-commit hook integration
- [ ] CDN asset remote whitelist fetch
