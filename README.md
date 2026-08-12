# My Operating Manual

A guided web application that helps individuals create a personal "operating manual" — a living document explaining how they work, communicate, and collaborate.

## 🎯 Purpose

My Operating Manual enables professionals to create shareable, PDF-backed guides that document their working style, values, communication preferences, decision-making processes, and collaboration guidelines. Perfect for new partnerships, team onboarding, or clarifying expectations with colleagues.

**Output:** A professional PDF document that serves as a shared reference for working together effectively.

## ✨ Features

### Core Functionality
- **12-Phase Guided Interview** — Comprehensive questionnaire covering identity, values, strengths, communication style, decision-making, feedback preferences, trust, boundaries, support, and more
- **Optional Deep-Dive Questions** — Additional prompts for each phase to explore nuances
- **Real-Time Manual Generation** — Interview responses converted to formatted markdown
- **Interactive Manual Preview** — Sidebar navigation with table of contents
- **PDF Export** — Download as professional PDF with embedded metadata

### System Architecture
- **Locked PDF Engine** — Single-purpose PDF generation (no generic exports, no Money Maker compatibility)
- **Version Metadata System** — Every PDF includes generation timestamp, app version, and build information
- **Build-Time Guard** — Prevents Money Maker App graph system from reappearing
- **Strict Asset Whitelist** — 6 approved images, rejects all others
- **Unified Error Handling** — Graceful error recovery with user-friendly messages
- **Pipeline Error Protection** — Try-catch wrapping on all 12 phases

### Developer Features
- **Developer Documentation Viewer** — In-app docs accessible via `Ctrl+Shift+D` in dev mode
- **Comprehensive Internal Docs** — 5 detailed guides covering architecture, pipeline, PDF engine, assets, and versioning
- **Asset Validation Script** — Scan for non-whitelisted or legacy assets
- **Build Guard System** — Automated checks for deprecated imports and contaminated code

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Developer Docs:**
- Press `Ctrl+Shift+D` to open the documentation viewer
- Or navigate to [http://localhost:5173/__devdocs](http://localhost:5173/__devdocs)

### Production Build

```bash
npm run build
```

The build process:
1. Runs build-time guard (checks for deprecated imports and graph system)
2. Validates PDF engine is locked to My Operating Manual only
3. Bundles with Vite
4. Dev-only features excluded from output
5. Documentation NOT included in production

### Preview

```bash
npm run preview
```

Preview the production build locally.

### Linting

```bash
npm run lint
```

## 📖 Developer Documentation

Full internal documentation is available in `/docs`:

- **[docs/README.md](docs/README.md)** — Documentation index and quick reference
- **[docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** — System architecture, modules, technology stack
- **[docs/PIPELINE.md](docs/PIPELINE.md)** — 12-phase interview system, state management, data flow
- **[docs/PDF_ENGINE.md](docs/PDF_ENGINE.md)** — Locked PDF generation, validation layers, version injection
- **[docs/ASSET_POLICY.md](docs/ASSET_POLICY.md)** — Asset whitelist, cleanup procedures, build hygiene
- **[docs/VERSIONING.md](docs/VERSIONING.md)** — Version metadata, semantic versioning, release checklist

### Accessing Docs in Development

**In-App Viewer (Dev Mode Only):**
- Press `Ctrl+Shift+D` in the browser
- Navigate to `/__devdocs`
- Sidebar lists all available documents
- Click to switch between docs
- Rendered with syntax highlighting and tables

**Console Message:**
When starting dev server, you'll see:
```
[DevTools] Docs viewer available at /__devdocs (or press Ctrl+Shift+D)
```

## 📁 Project Structure

```
my-operating-manual/
├── src/                                    # React source code
│   ├── pages/
│   │   ├── LandingPage/                   # Interview entry page
│   │   ├── GuidedInterview/               # Phase-by-phase interview
│   │   ├── OutputPage/                    # Manual display & export
│   │   └── DevDocs/                       # Documentation viewer (dev only)
│   ├── components/
│   │   ├── ActionBar/                     # Export/print controls
│   │   ├── ErrorDisplay.jsx               # Error UI
│   │   ├── PipelineFailedScreen.jsx       # Fallback error screen
│   │   ├── RerunButton.jsx                # Regenerate manual button
│   │   ├── ResetButton.jsx                # Reset interview button
│   │   ├── DownloadPdfButton.jsx          # PDF export button
│   │   └── ... (other components)
│   ├── context/
│   │   ├── AppStateContext.jsx            # Global state management
│   │   └── ThemeContext.jsx               # Theme toggle
│   ├── data/
│   │   ├── phases.js                      # 12 interview phases
│   │   └── optionalQuestions.js           # Optional follow-ups
│   ├── utils/
│   │   ├── manualGenerator.js             # Responses → markdown
│   │   ├── safePipelineOperations.js      # Safe operation wrappers
│   │   └── ... (other utilities)
│   └── styles/
│       └── global.css                     # App styling
│
├── modules/pdf-engine/                    # Locked PDF generation
│   ├── exportManager.js                   # Main entry point
│   ├── brandingConfig.js                  # Logo & branding
│   ├── version.json                       # Version metadata
│   ├── validators/
│   │   ├── inputSchema.js                 # Content validation
│   │   └── assetWhitelist.js              # Asset validation
│   ├── utils/
│   │   └── versionHelper.js               # Version injection
│   ├── pipeline/
│   │   ├── generatePdf.js                 # PDF generation
│   │   └── errorHandler.js                # Error system
│   ├── structure/
│   │   └── ... (PDF structure components)
│   └── assets/
│       └── Teal Read Me Logo.png          # Official logo
│
├── scripts/
│   ├── guards/
│   │   └── preventGraphRecreation.js      # Build-time guard
│   └── validateAssets.js                  # Asset validator
│
├── docs/                                  # Internal documentation
│   ├── README.md                          # Docs index
│   ├── PROJECT_OVERVIEW.md                # System overview
│   ├── PIPELINE.md                        # Interview system
│   ├── PDF_ENGINE.md                      # PDF generation
│   ├── ASSET_POLICY.md                    # Asset management
│   └── VERSIONING.md                      # Versioning system
│
├── public/                                # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
└── ... (config files: vite.config.js, package.json, etc.)
```

## 🔐 Locked Architecture

The PDF Engine is intentionally restrictive:

### Cannot Override
- **Brand** — Always "My Operating Manual"
- **Logo** — Always "Teal Read Me Logo.png"
- **Purpose** — Operating Manual content only

### Validation Enforced
1. **Schema Validation** — Rejects Money Maker terminology
2. **Asset Whitelist** — Only 6 approved images
3. **Content Validation** — Markdown must be Operating Manual

### Why Locked?
Prevents contamination, ensures consistency, and blocks unintended use.

## 📦 Asset Policy

### Approved Assets (6 Total)

| Asset | Purpose | Location |
|-------|---------|----------|
| `Teal Read Me Logo.png` | Branding | `src/assets/`, `modules/pdf-engine/assets/` |
| `hero.png` | Landing page | `src/assets/` |
| `react.svg` | Framework credit | `src/assets/` |
| `vite.svg` | Build tool credit | `src/assets/` |
| `favicon.svg` | App favicon | `public/` |
| `icons.svg` | Icon sprite | `public/` |

### Validation

```bash
# Check assets
node scripts/validateAssets.js

# Strict mode (fails if violations)
node scripts/validateAssets.js --strict

# Verbose output
node scripts/validateAssets.js --verbose
```

See [docs/ASSET_POLICY.md](docs/ASSET_POLICY.md) for adding new assets.

## 🛡️ Build-Time Guard

Prevents Money Maker App graph system from reappearing:

```bash
npm run build
# Runs: node scripts/guards/preventGraphRecreation.js && vite build
```

**Checks:**
- Graph asset folders (income*, niche*, monthly*)
- Deprecated PNG files
- Deprecated code imports (buildIncomeGraph, resolveNicheGraph, etc.)

Fails build if violations found.

## 📋 Versioning

### Version File

`modules/pdf-engine/version.json`:

```json
{
  "appVersion": "1.0.0",
  "pdfEngineVersion": "1.0.0",
  "pipelineVersion": "1.0.0",
  "buildTimestamp": "2026-08-12T05:10:00Z",
  "systemName": "My Operating Manual",
  "description": "Operating Manual PDF generation system..."
}
```

### Version Injection

Every generated PDF includes:

**HTML Comments:**
```html
<!-- Generated by My Operating Manual v1.0.0 -->
<!-- Build: 2026-08-12T05:10:00Z -->
<!-- App Version: 1.0.0 -->
```

**PDF Metadata:**
- appVersion, pdfEngineVersion, generatedAtUtc
- Visible in PDF properties (File → Properties → Custom)

See [docs/VERSIONING.md](docs/VERSIONING.md) for release procedures.

## ⚠️ Pipeline Error Handling

### Unified Error System

Every error includes:
- Error code (e.g., `PHASE_FAILED`, `PDF_EXPORT_FAILED`)
- User-friendly message (never shows stack traces)
- Technical details (logged to console)
- Phase number and context (if applicable)
- Timestamp for debugging

### Error Types

| Error | Recoverable | Scenario |
|-------|-----------|----------|
| `PHASE_FAILED` | Yes | Phase transition error |
| `GENERATION_FAILED` | Yes | Manual generation error |
| `MARKDOWN_GENERATION_FAILED` | Yes | Markdown generation error |
| `PDF_EXPORT_FAILED` | No | PDF generation error |
| `ASSET_WHITELIST_VIOLATION` | No | Asset not approved |
| `VALIDATION_FAILED` | Yes | Input validation error |

### Recovery UI

On error:
- Error screen displays with message
- If recoverable: "Try Again" button available
- Always: "Start Over" button to reset interview
- Always: "Contact Support" button

See [ERROR_HANDLING.md](ERROR_HANDLING.md) for error codes and debugging.

## 🎨 UI Components

### Action Buttons

**Rerun Pipeline**
- Regenerates manual from current responses
- Updates preview in real-time
- Useful when editing answers

**Reset Interview**
- Clears all data and returns to landing page
- Requires confirmation to prevent accidental reset

**Download PDF**
- Exports manual as professional PDF
- Uses locked PDF engine
- Includes version metadata and timestamps

**Other Actions**
- Copy markdown to clipboard
- Print to browser PDF
- Edit answers (return to interview)
- Start over (full reset)

## 👨‍💻 Development Workflow

### Creating a New Feature

1. **Plan** — Check [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) for architecture
2. **Develop** — Follow patterns in existing components
3. **Test** — Run `npm run dev`, test all 12 phases
4. **Validate** — Run `npm run lint`, `node scripts/validateAssets.js --strict`
5. **Document** — Update relevant docs in `/docs`
6. **Build** — Ensure `npm run build` succeeds

### Adding Interview Questions

1. Edit `src/data/phases.js` (change phase) or `src/data/optionalQuestions.js` (add optional)
2. Test in `npm run dev`
3. Verify manual includes new questions
4. Update [docs/PIPELINE.md](docs/PIPELINE.md) if adding phases
5. Commit with description

### Adding Assets

1. Create file in `src/assets/` or `public/`
2. Update `modules/pdf-engine/validators/assetWhitelist.js`
3. Run `node scripts/validateAssets.js --verbose`
4. Verify asset appears as whitelisted
5. Test in `npm run dev`
6. Commit both files

### Preparing a Release

1. Review changes since last release
2. Update versions in `modules/pdf-engine/version.json`
3. Update `buildTimestamp` to current UTC time
4. Run `npm run build` (verify no guard violations)
5. Test PDF generation
6. Verify version metadata in PDF
7. Commit: `git add modules/pdf-engine/version.json && git commit -m "Release v1.0.1"`
8. Tag: `git tag v1.0.1`

See [docs/VERSIONING.md](docs/VERSIONING.md) for complete checklist.

## 🧪 Testing

### Manual Testing

1. Start dev server: `npm run dev`
2. Walk through all 12 phases
3. Test manual generation
4. Test PDF export
5. Verify version metadata in PDF
6. Test error scenarios (refresh mid-phase, etc.)

### Asset Validation

```bash
node scripts/validateAssets.js --strict
# Exit code 0 = success, 1 = violations
```

### Build Guard

```bash
npm run build
# Checks for deprecated imports and graph system
```

### Linting

```bash
npm run lint
```

## 📚 References

| Topic | Reference |
|-------|-----------|
| System architecture | [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) |
| Interview phases | [docs/PIPELINE.md](docs/PIPELINE.md) |
| PDF generation | [docs/PDF_ENGINE.md](docs/PDF_ENGINE.md) |
| Assets & whitelist | [docs/ASSET_POLICY.md](docs/ASSET_POLICY.md) |
| Versioning & releases | [docs/VERSIONING.md](docs/VERSIONING.md) |
| Error codes | [ERROR_HANDLING.md](ERROR_HANDLING.md) |
| Asset validation | [ASSET_WHITELIST.md](ASSET_WHITELIST.md) |

## 🔧 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.2.8 |
| Build Tool | Vite | 8.2.0 |
| State Management | React Context API | - |
| Markdown Parsing | marked | 18.0.9 |
| PDF Generation | jsPDF + html2canvas | 4.2.1 + 1.4.1 |
| HTML Sanitization | DOMPurify | 3.4.13 |
| Linting | oxlint | 1.75.0 |

## 📝 License

Internal use only.

## 🆘 Support

For issues or questions:

1. Check [docs/README.md](docs/README.md) for quick reference
2. Search relevant topic doc ([PIPELINE.md](docs/PIPELINE.md), [PDF_ENGINE.md](docs/PDF_ENGINE.md), etc.)
3. Check [ERROR_HANDLING.md](ERROR_HANDLING.md) for error codes
4. Review code comments in relevant files
5. Check git history for context

## 🎓 Learning Path

**New to the project?**

1. Read this file (README.md) — Overview
2. Read [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) — Architecture
3. Read [docs/PIPELINE.md](docs/PIPELINE.md) or [docs/PDF_ENGINE.md](docs/PDF_ENGINE.md) — Deep dive based on work focus
4. Read specific reference as needed

**Familiar with the project?**

- Press `Ctrl+Shift+D` to access docs in dev mode
- Refer to [docs/README.md](docs/README.md) for quick navigation
- Check [docs/ASSET_POLICY.md](docs/ASSET_POLICY.md) for maintenance tasks
- Check [docs/VERSIONING.md](docs/VERSIONING.md) for releases

---

**Built with ❤️ by [Your Name/Team]**
