# Version Metadata System

**Date:** August 12, 2026, 05:15 UTC  
**Status:** ✅ **IMPLEMENTED**

---

## Overview

Version metadata has been integrated into every Operating Manual PDF to provide:

- **Audit Trail** — Track which version generated the PDF
- **System Info** — Document the PDF engine and pipeline versions
- **Timestamp** — Record exact generation time
- **Transparency** — Show complete version information

---

## Components

### 1. Version Configuration
**File:** `modules/pdf-engine/version.json`

```json
{
  "pdfEngineVersion": "1.0.0",
  "pipelineVersion": "1.0.0",
  "appVersion": "1.0.0",
  "buildTimestamp": "2026-08-12T05:10:00Z",
  "systemName": "My Operating Manual",
  "description": "Operating Manual PDF generation system - locked architecture"
}
```

### 2. Version Helper Module
**File:** `modules/pdf-engine/utils/versionHelper.js`

**Exports:**
- `loadVersionMetadata()` — Load version.json
- `getVersionWithTimestamp()` — Get version + runtime timestamp
- `formatVersionFooter()` — Format for PDF footer
- `formatVersionHeader()` — Format for markdown
- `formatVersionHtmlComment()` — Format for HTML comments
- `getCompleteVersionInfo()` — Get full version object
- `getVersionString()` — Get version string for logging

### 3. Integration Points

**exportManager.js:**
- Imports version helper
- Loads version metadata
- Includes in PDF metadata
- Adds HTML version comment

**Generated PDFs:**
- Version info in metadata
- HTML comment with timestamp
- Timestamp embedded in rendering

---

## Version Information Included

### In PDF Metadata
```
appVersion: "1.0.0"
pdfEngineVersion: "1.0.0"
generatedAtUtc: "2026-08-12T05:15:23.456Z"
```

### In HTML Comments
```html
<!-- My Operating Manual v1.0.0 | PDF Engine v1.0.0 | Generated 2026-08-12 05:15:23 -->
```

### In PDF Footer (Optional)
```
Operating Manual v1.0.0 | PDF Engine v1.0.0 | Generated 2026-08-12 05:15:23
```

---

## Usage

### Accessing Version Info

**In Code:**
```javascript
import { getVersionWithTimestamp } from './modules/pdf-engine/utils/versionHelper.js';

const version = getVersionWithTimestamp();
console.log(`Generated at: ${version.generatedAt}`);
console.log(`App version: ${version.appVersion}`);
```

### Viewing in PDF

**PDF Metadata (Properties):**
- Right-click PDF → Properties
- See `appVersion`, `pdfEngineVersion`, `generatedAtUtc`

**HTML Source (Dev Tools):**
- Right-click PDF in browser
- View page source
- Look for HTML comment: `<!-- My Operating Manual v... -->`

---

## Version Lifecycle

### Build Time
```
1. version.json defines static versions
2. buildTimestamp set at build time
```

### PDF Generation Time
```
1. generateOperatingManualPdf() called
2. Version helper loads version.json
3. Runtime timestamp added (generatedAt)
4. Version metadata embedded in PDF
5. Each PDF has unique generation time
```

### Access Time
```
1. User opens PDF
2. Metadata visible in properties
3. HTML comment visible in source
```

---

## Updating Versions

### To Update App Version

Edit `modules/pdf-engine/version.json`:

```json
{
  "appVersion": "1.1.0",  // ← Update this
  "pdfEngineVersion": "1.0.0",
  ...
}
```

Then rebuild:
```bash
npm run build
```

### To Update PDF Engine Version

Edit `modules/pdf-engine/version.json`:

```json
{
  "appVersion": "1.0.0",
  "pdfEngineVersion": "1.1.0",  // ← Update this
  ...
}
```

### Build Timestamp

Automatically set at build time. Each build gets current timestamp.

---

## Format Examples

### Version Footer
```
Operating Manual v1.0.0 | PDF Engine v1.0.0 | Generated 2026-08-12 05:15:23
```

### Version Header (Markdown)
```
**Document Version:** 1.0.0
**PDF Engine:** v1.0.0
**Generated:** 2026-08-12 05:15:23
```

### Version HTML Comment
```html
<!-- My Operating Manual v1.0.0 | PDF Engine v1.0.0 | Generated 2026-08-12 05:15:23 -->
```

---

## No Breaking Changes

✅ **Styling unchanged** — Version info in metadata/comments only  
✅ **Layout unchanged** — No impact on PDF layout  
✅ **UI unchanged** — No UI modifications  
✅ **Branding unchanged** — No changes to branding.json or layout.json  

---

## Benefits

1. **Audit Trail** — Track which version generated each PDF
2. **Traceability** — Connect PDFs to specific app versions
3. **Debugging** — Version info helps identify issues
4. **Transparency** — Users know system/engine versions
5. **Compliance** — Version metadata for record-keeping

---

## Technical Details

### Version Helper Functions

**formatDateTime():**
```javascript
// Converts ISO timestamp to human-readable format
// Input: "2026-08-12T05:15:23.456Z"
// Output: "2026-08-12 05:15:23"
```

**getVersionWithTimestamp():**
```javascript
// Returns version object with runtime timestamp added
{
  pdfEngineVersion: "1.0.0",
  appVersion: "1.0.0",
  buildTimestamp: "2026-08-12T05:10:00Z",
  generatedAt: "2026-08-12T05:15:23.456Z"  // ← Added at runtime
}
```

---

## Verification

**Check version info in generated PDF:**

1. Open PDF in Adobe Reader or browser
2. Right-click → Properties
3. Look for custom fields with version info

OR

1. Open PDF in text editor
2. Search for "My Operating Manual v"
3. Find HTML comment with version

---

**Implementation Date:** 2026-08-12T05:15:00Z  
**Status:** ✅ COMPLETE
