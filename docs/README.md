# My Operating Manual - Documentation Index

## Quick Start

New to the project? Start here:

1. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** — What is My Operating Manual? Architecture, modules, and tech stack.
2. **[PIPELINE.md](./PIPELINE.md)** — How the 12-phase interview works and how data flows through the system.
3. **[PDF_ENGINE.md](./PDF_ENGINE.md)** — How PDFs are generated with locked architecture and validation.

## Core Documentation

### User-Facing

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** — High-level system overview
- **[PIPELINE.md](./PIPELINE.md)** — Interview process and data flow
- **[PDF_ENGINE.md](./PDF_ENGINE.md)** — PDF generation and download

### Developer-Facing

- **[ASSET_POLICY.md](./ASSET_POLICY.md)** — Asset whitelist and cleanup rules
- **[VERSIONING.md](./VERSIONING.md)** — Version metadata and propagation

## External References

These documents are in the root but provide critical information:

- **[ERROR_HANDLING.md](../ERROR_HANDLING.md)** — Error handling system, error codes, recovery
- **[ASSET_WHITELIST.md](../ASSET_WHITELIST.md)** — Asset validation details and usage
- **[ASSET_WHITELIST_IMPLEMENTATION.md](../ASSET_WHITELIST_IMPLEMENTATION.md)** — Implementation summary

## By Topic

### Getting Started

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) — Purpose, architecture, modules
- [PIPELINE.md](./PIPELINE.md) — Interview flow overview

### Development

- [PDF_ENGINE.md](./PDF_ENGINE.md) — PDF generation details
- [../ERROR_HANDLING.md](../ERROR_HANDLING.md) — Error handling during development
- [ASSET_POLICY.md](./ASSET_POLICY.md) — Asset management

### Maintenance

- [ASSET_POLICY.md](./ASSET_POLICY.md) — Asset cleanup and hygiene
- [VERSIONING.md](./VERSIONING.md) — Version management and releases
- [../ASSET_WHITELIST.md](../ASSET_WHITELIST.md) — Asset scanning and validation

### Operations

- [VERSIONING.md](./VERSIONING.md) — Release checklist
- [ASSET_POLICY.md](./ASSET_POLICY.md) — Build hygiene checks
- [../ERROR_HANDLING.md](../ERROR_HANDLING.md) — Monitoring and debugging

## Document Summaries

### PROJECT_OVERVIEW.md

**Purpose:** Understand what My Operating Manual does and how it's structured.

**Key Sections:**
- Purpose and use cases
- Core values
- Architecture overview (data flow diagram)
- System modules breakdown
- Technology stack
- Key constraints
- Future extensibility

**Read if:** You're new to the project or need a refresher on the big picture.

### PIPELINE.md

**Purpose:** Understand the 12-phase interview process and how user data flows through the system.

**Key Sections:**
- The 12 phases with descriptions
- Optional questions system
- State management (AppStateContext)
- Data flow from responses to PDF
- Manual generation and markdown formatting
- Phase progression and completion
- Safe pipeline operations

**Read if:** You're working on interview UX, state management, or manual generation.

### PDF_ENGINE.md

**Purpose:** Understand how PDFs are generated with locked architecture, validation, and version metadata.

**Key Sections:**
- Architecture and validation layers
- Entry point (generateOperatingManualPdf)
- Input validation (schema + assets)
- Version metadata injection
- Locked branding (cannot override)
- PDF generation pipeline
- Error codes
- Usage examples
- Testing guidance

**Read if:** You're working on PDF export, adding validation, or debugging PDF issues.

### ASSET_POLICY.md

**Purpose:** Understand approved assets, cleaning up contamination, and build hygiene.

**Key Sections:**
- Asset whitelist (what's approved)
- Non-approved assets (Money Maker detection)
- Scanning and validation
- Cleanup procedures
- Adding new assets
- Protection layers
- Edge cases
- Testing procedures

**Read if:** You're cleaning up assets, adding new images, or ensuring build hygiene.

### VERSIONING.md

**Purpose:** Understand how version metadata is tracked, injected, and used.

**Key Sections:**
- Version file structure (version.json)
- Semantic versioning rules
- Build timestamp vs generated timestamp
- Version propagation and injection
- Checking versions in PDFs
- Release checklist
- Compatibility and future decoupling

**Read if:** You're preparing a release, checking PDF metadata, or troubleshooting version issues.

## File Locations

```
docs/
├── README.md                           ← This file
├── PROJECT_OVERVIEW.md                 ← Start here
├── PIPELINE.md                         ← Interview system
├── PDF_ENGINE.md                       ← PDF generation
├── ASSET_POLICY.md                     ← Asset whitelist
└── VERSIONING.md                       ← Versioning system

Root-level docs (related):
├── ERROR_HANDLING.md                   ← Error system
├── ASSET_WHITELIST.md                  ← Asset validation
├── ASSET_WHITELIST_IMPLEMENTATION.md   ← Implementation details
├── BUILD_GUARD_FINAL_REPORT.md         ← Build guard system
└── ... (other docs)
```

## Key Concepts Glossary

### Operating Manual
A personal document that explains how someone works, communicates, and collaborates. Typically 5-15 pages PDF.

### Phase
One of 12 interview steps that captures a different aspect of how someone works (identity, values, communication style, etc.).

### Pipeline
The 12-phase interview process that collects user responses and generates the manual.

### PDF Engine
The locked, single-purpose module that converts interview responses into PDF files. Cannot be used for other purposes.

### Locked Architecture
Design constraint: certain options (brand, logo) cannot be overridden to prevent contamination or misuse.

### Asset Whitelist
Approved list of image files (6 files) that can be used in the system. All others are rejected.

### Schema Validation
Check that input matches expected format and doesn't contain prohibited content (e.g., Money Maker references).

### Version Metadata
Information about when and how the PDF was generated (app version, build timestamp, generation timestamp).

### Build Hygiene
Ensuring no contaminated or deprecated assets/imports end up in production builds.

## Common Tasks

### Starting Development

1. Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
2. Run `npm install && npm run dev`
3. Open browser to dev server
4. Explore codebase

### Adding a New Interview Question

1. Edit `src/data/optionalQuestions.js` (optional) or `src/data/phases.js` (phase changes)
2. Update [PIPELINE.md](./PIPELINE.md) if adding new phase
3. Test in `npm run dev`
4. Verify manual generation includes new question

### Adding a New Asset

1. Create asset file
2. Update `modules/pdf-engine/validators/assetWhitelist.js`
3. Run `node scripts/validateAssets.js --verbose`
4. Verify asset appears as whitelisted
5. Commit both files

### Preparing a Release

1. Review changes since last release
2. Update version numbers in `modules/pdf-engine/version.json`
3. Update `buildTimestamp` to current UTC time
4. Run `npm run build` (checks guards + validates assets)
5. Test PDF generation
6. Verify version metadata in PDF
7. Commit version changes
8. Tag release: `git tag v1.0.1`

### Debugging a PDF Issue

1. Check [PDF_ENGINE.md](./PDF_ENGINE.md) for validation layers
2. Check console for error messages
3. Check PDF properties for version info
4. Compare with [VERSIONING.md](./VERSIONING.md) for expected behavior
5. Reference [../ERROR_HANDLING.md](../ERROR_HANDLING.md) for error codes

### Cleaning Up Assets

1. Run `node scripts/validateAssets.js`
2. Identify violations
3. Review [ASSET_POLICY.md](./ASSET_POLICY.md) cleanup rules
4. Delete unauthorized files
5. Run `node scripts/validateAssets.js --strict` to verify
6. Commit cleanup

## Architecture Diagrams

### High-Level System Flow

```
User
  ↓
Landing Page (name entry)
  ↓
Interview (12 phases)
  ↓
Manual Generation (markdown)
  ↓
Manual Display (with TOC)
  ↓
PDF Export (locked engine)
  ↓
Download (browser)
```

### Validation Layers

```
Input
  ↓ Schema Validation (content, brand, logo checks)
  ↓ Asset Whitelist (logo must be approved)
  ↓ HTML Processing (markdown → HTML)
  ↓ PDF Generation (HTML → Canvas → PDF)
  ↓ Version Injection (metadata + comments)
  ↓
PDF File
```

### State Management

```
AppStateContext
├── view ('landing'|'interview'|'output')
├── currentPhase (0-11)
├── responses ({phaseId: text})
├── optionalResponses ({questionId: text})
├── manualMarkdown (generated markdown)
├── isInterviewComplete (boolean)
├── authorName (string)
├── error (PipelineError | null)
└── isLoading (boolean)
```

## Quick Reference

### Version Numbers
- App: Check `modules/pdf-engine/version.json` → `appVersion`
- Pipeline: Check `modules/pdf-engine/version.json` → `pipelineVersion`
- PDF Engine: Check `modules/pdf-engine/version.json` → `pdfEngineVersion`

### Build Commands
```bash
npm run dev        # Start dev server
npm run build      # Build for production (runs guards)
npm run lint       # Lint code
npm run preview    # Preview production build
```

### Validation Commands
```bash
node scripts/validateAssets.js              # Check assets
node scripts/validateAssets.js --verbose    # Show all assets
node scripts/validateAssets.js --strict     # Fail on violations
node scripts/guards/preventGraphRecreation.js  # Check for Money Maker
```

### Key Files
- Phases: `src/data/phases.js`
- Optional Questions: `src/data/optionalQuestions.js`
- Manual Generation: `src/utils/manualGenerator.js`
- State: `src/context/AppStateContext.jsx`
- PDF Engine: `modules/pdf-engine/exportManager.js`
- Version: `modules/pdf-engine/version.json`
- Asset Whitelist: `modules/pdf-engine/validators/assetWhitelist.js`

## Getting Help

| Question | Resource |
|----------|----------|
| What is this project? | [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) |
| How does the interview work? | [PIPELINE.md](./PIPELINE.md) |
| How are PDFs generated? | [PDF_ENGINE.md](./PDF_ENGINE.md) |
| What assets are allowed? | [ASSET_POLICY.md](./ASSET_POLICY.md) |
| How does versioning work? | [VERSIONING.md](./VERSIONING.md) |
| How are errors handled? | [../ERROR_HANDLING.md](../ERROR_HANDLING.md) |
| How to validate assets? | [../ASSET_WHITELIST.md](../ASSET_WHITELIST.md) |

## Contributing

When making changes:

1. **Update relevant documentation** — If code changes, update docs
2. **Follow architecture** — Don't break locked constraints
3. **Test thoroughly** — Especially PDF generation and validation
4. **Validate assets** — Run `node scripts/validateAssets.js --strict`
5. **Check version** — Consider if version bump is needed
6. **Commit clearly** — Reference which doc was updated

## Questions or Issues?

Refer to the appropriate documentation:
- Feature requests → [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) Future Extensibility
- Bugs → Check [../ERROR_HANDLING.md](../ERROR_HANDLING.md) and [PDF_ENGINE.md](./PDF_ENGINE.md)
- Asset issues → [ASSET_POLICY.md](./ASSET_POLICY.md) and [../ASSET_WHITELIST.md](../ASSET_WHITELIST.md)
