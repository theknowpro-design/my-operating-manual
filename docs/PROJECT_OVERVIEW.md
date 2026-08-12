# My Operating Manual - Project Overview

## Purpose

My Operating Manual is a guided web application that helps individuals create a personal "operating manual" — a living document that explains how they work, communicate, collaborate, and make decisions.

**Use Case:** Two professionals (e.g., Jordan and Alex) complete a 12-phase interview to document their working style, values, feedback preferences, and collaboration guidelines. The result is a downloadable PDF manual that serves as a shared reference for their partnership.

**End Product:** A professional PDF document that can be shared with colleagues, team members, or collaborators to set clear expectations and improve working relationships.

## Core Values

- **Single-purpose** — Generates *only* Operating Manual PDFs, never generic content
- **Locked architecture** — No overrides, no Money Maker compatibility, no legacy systems
- **Transparent versioning** — Every PDF includes generation date, app version, and engine version
- **Asset hygiene** — Strict whitelist prevents contamination from legacy projects
- **Error resilience** — Graceful handling with clear user feedback
- **Developer-friendly** — Comprehensive logging, clear error codes, testable validation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  Landing → Interview (12 phases) → Output → PDF Export       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   State Management         │
        │ (AppStateContext)          │
        │ - Phase progress           │
        │ - Responses                │
        │ - Error handling           │
        │ - Manual markdown          │
        └────────────────────────────┘
                     │
        ┌────────────┴─────────────────────────────────────┐
        │                                                  │
        ▼                                                  ▼
    ┌──────────────────┐                      ┌────────────────────────┐
    │ Manual Generator │                      │  PDF Engine            │
    │ (manualGenerator │                      │ (exportManager.js)     │
    │ .js)             │                      │                        │
    │                  │                      │ - Input validation     │
    │ Converts         │                      │ - Schema enforcement   │
    │ interview        │  ──────────────────→ │ - Asset whitelist      │
    │ responses        │ Markdown HTML        │ - Locked branding      │
    │ into markdown    │                      │ - Version metadata     │
    └──────────────────┘                      └────────────────────────┘
                                                       │
                                                       ▼
                                            ┌────────────────────────┐
                                            │   PDF Pipeline         │
                                            │ (generatePdf.js)       │
                                            │                        │
                                            │ - HTML to canvas       │
                                            │ - Canvas to PDF        │
                                            │ - File download        │
                                            └────────────────────────┘
```

## System Modules

### 1. Frontend (`src/`)

React application with Vite bundler.

**Key Files:**
- `App.jsx` — Main app shell with error boundary
- `context/AppStateContext.jsx` — Global state (phases, responses, manual)
- `pages/LandingPage/` — Interview start page
- `pages/GuidedInterview/` — Phase-by-phase interview
- `pages/OutputPage/` — Manual display and export
- `components/` — Reusable UI components
- `utils/manualGenerator.js` — Interview → Markdown conversion
- `utils/safePipelineOperations.js` — Safe operation wrappers

**State Shape:**
```javascript
{
  view: 'landing|interview|output',
  currentPhase: 0,                    // 0-11
  responses: { phaseId: text, ... },
  optionalResponses: { questionId: text, ... },
  manualMarkdown: '',
  isInterviewComplete: boolean,
  authorName: string,
  error: PipelineError|null,
  isLoading: boolean,
}
```

### 2. PDF Engine (`modules/pdf-engine/`)

Locked, single-purpose PDF generation system.

**Architecture:**
- **Input Validation** — Schema enforcement + legacy detection
- **Asset Validation** — Whitelist enforcement
- **HTML Processing** — Markdown → HTML conversion
- **PDF Generation** — HTML → Canvas → PDF
- **Version Injection** — Metadata + HTML comments
- **File Export** — Browser download

**Key Files:**
- `exportManager.js` — Locked entry point (generateOperatingManualPdf)
- `validators/inputSchema.js` — Content validation
- `validators/assetWhitelist.js` — Asset validation
- `pipeline/generatePdf.js` — PDF generation logic
- `utils/versionHelper.js` — Version metadata
- `brandingConfig.js` — Locked branding settings
- `version.json` — Version information

**Locked Options:**
- Brand: `"My Operating Manual"` (cannot override)
- Logo: `Teal Read Me Logo.png` (cannot override)
- Filename: Auto-generated from title

**Permissible Options:**
- `title` — PDF document title
- `subtitle` — Subtitle text
- `author` — Author name
- `generatedAt` — Generation timestamp
- `metadata` — Additional PDF metadata

### 3. Build Guard (`scripts/guards/`)

Prevents Money Maker App graph system from reappearing.

**Key Files:**
- `preventGraphRecreation.js` — Scans for deprecated files/imports
- `GUARD_DOCUMENTATION.md` — Guard system docs

**Checks:**
- Graph asset folders (`income*`, `niche*`, `monthly*`)
- Deprecated PNG files
- Deprecated code imports

### 4. Asset Validator (`scripts/validateAssets.js`)

Prevents asset contamination.

**Approved Assets:**
- `Teal Read Me Logo.png` — Branding
- `hero.png` — Landing page
- `react.svg` — React credit
- `vite.svg` — Vite credit
- `favicon.svg` — App favicon
- `icons.svg` — Icon sprite

**Whitelist Module:** `modules/pdf-engine/validators/assetWhitelist.js`

### 5. Error Handler (`modules/pipeline/errorHandler.js`)

Unified error handling system.

**Features:**
- Structured error objects (code, message, detail, phase)
- Safe fallback messages (no stack traces)
- Logging hooks (custom error tracking)
- Error recovery (distinguishes recoverable vs fatal)
- Safe formatting (user-friendly error display)

## Data Flow

### Interview to Manual to PDF

```
User Input
    ↓
Phase 1-12 Responses (stored in AppStateContext)
    ↓
generateManualMarkdown()
    ↓
Formatted Markdown (with headings, callouts, TOC)
    ↓
Display in ManualRenderer (HTML preview)
    ↓
User clicks "Export PDF"
    ↓
generateOperatingManualPdf(markdown, options)
    ↓
[Validation]
  - Input schema validation
  - Asset whitelist check
    ↓
[Processing]
  - Markdown → HTML conversion
  - Logo URL resolution
  - Branding application
    ↓
[Injection]
  - Version metadata
  - Timestamp
  - Author info
    ↓
[PDF Generation]
  - HTML → Canvas (html2canvas)
  - Canvas → PDF (jsPDF)
  - Version info in PDF metadata
    ↓
Browser Download
    ↓
User receives: "YourName's Operating Manual.pdf"
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 | UI framework |
| Build Tool | Vite 8 | Fast bundling |
| State | React Context | Global state |
| Markdown | marked 18 | Parse interview markdown |
| PDF | jsPDF 4 + html2canvas 1 | Generate PDF |
| Sanitize | DOMPurify 3 | Safe HTML processing |
| Linter | oxlint 1 | Code quality |
| CSS | Custom | Responsive design |

## Key Constraints

1. **Single Purpose**
   - Only accepts Operating Manual content
   - Rejects Money Maker, Profit Engine, generic HTML
   - Cannot be extended to other PDF types

2. **Locked Branding**
   - Logo cannot be overridden
   - Brand name fixed to "My Operating Manual"
   - Asset whitelist prevents logo changes

3. **No Legacy Support**
   - No Money Maker graph system
   - No Profit Engine features
   - No backward compatibility with old projects

4. **Build-Time Enforcement**
   - Graph recreation guard runs before build
   - Asset validator can be integrated
   - Prevents contamination at build time

5. **Runtime Validation**
   - All inputs validated against schema
   - All assets validated against whitelist
   - All PDFs include version metadata

## Development Workflow

### Starting Development

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 5173+)
```

### Building for Production

```bash
npm run build           # Runs:
                        # 1. preventGraphRecreation guard
                        # 2. Vite build
npm run preview         # Preview production build
```

### Validation

```bash
npm run lint                           # Lint source code
node scripts/validateAssets.js         # Check assets
node scripts/validateAssets.js --strict # Fail on violations
```

## Error Handling Strategy

| Error Type | Handling | User Sees |
|-----------|----------|-----------|
| Phase transition | Try-catch in goNextPhase | "Phase X failed, try again" |
| Manual generation | Try-catch in completeInterview | "Could not generate manual" |
| Asset violation | Pre-check in PDF export | "Asset not on whitelist" |
| PDF export | Try-catch in download | "PDF export failed" |
| Unknown error | Fallback message | "Unexpected error" |

All errors:
- Logged to console with context
- Stored in state with code and detail
- Display in error screen with recovery options
- Include timestamp for debugging

## Future Extensibility

While the system is locked against contamination, it is designed to accept:

- [ ] New interview phases (edit `data/phases.js`)
- [ ] New optional questions (edit `data/optionalQuestions.js`)
- [ ] New approved assets (update `assetWhitelist.js`)
- [ ] Custom CSS theming (CSS variables)
- [ ] Additional metadata fields
- [ ] Export formats (Markdown, HTML in addition to PDF)

## Documentation Index

- **PIPELINE.md** — 12-phase interview process detail
- **PDF_ENGINE.md** — Locked PDF generation architecture
- **ASSET_POLICY.md** — Asset whitelist and cleanup rules
- **VERSIONING.md** — Version metadata and tagging
- **ERROR_HANDLING.md** — Error handling system
- **ASSET_WHITELIST.md** — Asset validation details
