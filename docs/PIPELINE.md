# My Operating Manual - Pipeline Documentation

## 12-Phase Interview Process

The core of My Operating Manual is a guided 12-phase interview that captures how an individual works, communicates, and collaborates.

### Phase Structure

Each phase has:
- **ID** — Unique identifier (kebab-case)
- **Number** — Display number (1-12)
- **Title** — Phase name
- **Description** — What this phase captures
- **Question** — Primary interview question
- **Placeholder** — Example answer
- **Callout** — Guidance note

### The 12 Phases

| # | ID | Title | Captures | Question |
|---|-------|-------|----------|----------|
| 1 | `identity` | Identity & Role | Who you are, your roles | "How would you introduce yourself and the roles you currently hold?" |
| 2 | `values` | Values & Principles | Non-negotiables, trade-offs | "What values and principles guide your decisions day to day?" |
| 3 | `strengths` | Strengths & Superpowers | Where you create value | "What are you especially good at?" |
| 4 | `growth` | Growth Edges | Development areas, blind spots | "Where are you stretching?" |
| 5 | `communication` | Communication Style | Preferences for info flow | "How do you prefer to communicate?" |
| 6 | `working-style` | Working Style & Energy | Productive patterns, peak hours | "What does a productive workday look like?" |
| 7 | `decisions` | Decision Making | How you prioritize and decide | "How do you make decisions?" |
| 8 | `feedback` | Feedback Preferences | Giving/receiving feedback | "How do you prefer feedback?" |
| 9 | `trust` | Trust & Collaboration | What builds/erodes trust | "What builds trust with you?" |
| 10 | `boundaries` | Boundaries & Constraints | Limits that protect best work | "What boundaries should others respect?" |
| 11 | `support` | How to Help Me | Support when stuck/overloaded | "When you're stuck, what help helps?" |
| 12 | `working-with-me` | Working With Me | 5-point practical summary | "5 things people should remember?" |

### Optional Questions

Each phase can have optional follow-up questions for deeper exploration. Located in `src/data/optionalQuestions.js`.

**Structure:**
```javascript
{
  id: 'unique-id',
  phaseId: 'phase-id',
  prompt: 'Follow-up question text?',
  placeholder: 'Example answer...',
}
```

## Data Flow

### Phase Progression

```
Landing Page (get author name)
        ↓
        ↓ startInterview(authorName)
        ↓
Interview Phase 0 (Identity)
        ↓ [User answers phase question + optional questions]
        ↓
        ↓ goNextPhase()
        ↓
Interview Phase 1 (Values)
        ↓ [User answers...]
        ↓
... [Phases 2-10] ...
        ↓
Interview Phase 11 (Working With Me - final phase)
        ↓ [User answers...]
        ↓
        ↓ goNextPhase() [detects currentPhase >= TOTAL_PHASES-1]
        ↓
        ↓ generateManualMarkdown() [all responses → markdown]
        ↓
        ↓ setView('output')
        ↓
Output Page (manual display + export)
        ↓ [User reviews manual]
        ↓
        ↓ User clicks "Export PDF"
        ↓
generateOperatingManualPdf(markdown, options)
        ↓ [... PDF generation pipeline ...]
        ↓
Browser Downloads PDF
```

## State Management

### AppStateContext (src/context/AppStateContext.jsx)

Global state for the entire application.

**State Structure:**
```javascript
{
  // Navigation
  view: 'landing' | 'interview' | 'output',
  
  // Progress
  currentPhase: 0-11,
  isInterviewComplete: boolean,
  
  // Responses
  responses: {
    'identity': 'User answered text...',
    'values': 'User answered text...',
    // ... one per phase
  },
  optionalResponses: {
    'identity-optional-1': 'User answered...',
    // ... optional questions
  },
  
  // Author
  authorName: 'Jordan' | 'Alex' | '',
  
  // Output
  manualMarkdown: '# Jordan\'s Operating Manual\n\n...',
  
  // Errors
  error: {
    code: 'PHASE_FAILED',
    message: 'User-friendly message',
    detail: 'Technical details',
    phaseNumber: 3,
    originalError: Error,
    timestamp: '2026-08-12T...',
  } | null,
  
  // Loading
  isLoading: false,
}
```

### Handlers

**Phase Navigation:**
- `goNextPhase()` — Advance to next phase (or complete interview)
- `goPrevPhase()` — Go back one phase
- `setCurrentPhase(number)` — Jump to phase

**Response Collection:**
- `setResponse(phaseId, text)` — Store phase response
- `setOptionalResponse(questionId, text)` — Store optional response

**Interview Control:**
- `startInterview(authorName)` — Begin interview
- `completeInterview()` — Finish and generate manual
- `regenerateManual()` — Re-generate from current responses
- `resetInterview()` — Clear all data (return to landing)

**UI Navigation:**
- `setView(view)` — Change view ('landing', 'interview', 'output')

**Author Info:**
- `setAuthorName(name)` — Store author name

**Error Handling:**
- `setError(error)` — Store error
- `resetError()` — Clear error
- `setLoading(boolean)` — Set loading state

**Computed Properties:**
- `progress` — 0-100% based on phase completion
- `totalPhases` — Total number of phases (12)

## Manual Generation

### generateManualMarkdown(options)

Converts interview responses into structured markdown.

**Input:**
```javascript
{
  responses: {           // Required
    'phaseId': 'text',
    // ...
  },
  optionalResponses: {   // Required
    'questionId': 'text',
    // ...
  },
  authorName: 'Jordan',  // Optional
  generatedAt: Date,     // Optional
}
```

**Output:**
```markdown
# Jordan's Operating Manual

> A living guide to how I work, communicate, and collaborate. Generated on Aug 12, 2026.

---

## 1. Identity & Role

> **Note:** Lead with how you want others to understand your context.

I'm a product lead who straddles strategy and hands-on delivery…

### Optional sub-question?

Answer to optional...

## 2. Values & Principles

> **Note:** Think about trade-offs you consistently make.

Clarity over speed, candor with kindness, ownership…

... [Phases 3-11] ...

## Quick Reference

Use the points above as the shared contract for working together. Revisit this manual when roles, constraints, or collaboration patterns change.
```

**Features:**
- Title with author name
- Generated date
- Phase headings with callout notes
- Auto-detection of bullet-list answers
- Optional questions nested under phases
- Quick reference closing section

### Markdown Formatting

**Bullet Detection:**
- If answer contains multiple lines that look like bullets (start with `-`, `*`, `•`, or `1.`)
- Format each as markdown bullet list

**Paragraph Formatting:**
- Single-line or non-bullet text stays as-is
- Trimmed and cleaned

**Section Organization:**
```
## {number}. {title}

> **Note:** {callout}

{formatted answer}

### {optional-question-text}

{formatted optional-answer}

### {next-optional-question-text}

{formatted optional-answer}
```

## TOC Extraction

### extractTocFromMarkdown(markdown)

Parses generated markdown to create table of contents.

**Extraction:**
- Finds all `##` (level 2) and `###` (level 3) headings
- Extracts heading text
- Generates slug IDs for linking

**Output:**
```javascript
[
  { level: 2, title: '1. Identity & Role', id: '1-identity-role' },
  { level: 3, title: 'Follow-up question?', id: 'follow-up-question' },
  { level: 2, title: '2. Values & Principles', id: '2-values-principles' },
  // ...
]
```

**Used by:**
- SidebarTOC component (quick nav)
- PDF renderer (optional TOC page)

## Pipeline Validation

### Data Validation Layers

```
User Input
    ↓
Phase Input Validator
  ✓ Must be string
  ✓ Can be empty (optional)
  ✓ No length limits
    ↓
Response Storage (AppStateContext)
  ✓ Stored in state
  ✓ Can be edited anytime
    ↓
Phase Transition
  ✓ Advance phase if valid
  ✗ Handle errors gracefully
    ↓
Manual Generation
  ✓ Validate all responses present
  ✗ Handle empty responses
  ✓ Format markdown safely
    ↓
Manual Complete
  ✓ Store in state
  ✓ Display in output view
```

### Error Scenarios

| Scenario | Error Code | Recovery |
|----------|-----------|----------|
| Phase generation fails | `PHASE_FAILED` | Retry current phase |
| Manual markdown generation fails | `GENERATION_FAILED` | Rerun manual generation |
| Complete interview fails | `MARKDOWN_GENERATION_FAILED` | Retry completing |
| State sync fails | `STATE_SYNC_FAILED` | Check browser console |

## Interview Completion

### What Happens on Completion

When user finishes phase 12:

1. **Detect Completion**
   - `goNextPhase()` checks if `currentPhase >= TOTAL_PHASES - 1`

2. **Generate Manual**
   - Call `generateManualMarkdown()` with all responses
   - Markdown includes all phase answers + optional answers

3. **Update State**
   - `isInterviewComplete = true`
   - `manualMarkdown = <generated markdown>`
   - `view = 'output'`
   - `error = null`

4. **Display Output**
   - ManualRenderer shows formatted markdown
   - SidebarTOC shows quick navigation
   - ActionBar shows export options

5. **Export Options**
   - Copy markdown to clipboard
   - Print to PDF (browser print)
   - Download as PDF (generateOperatingManualPdf)
   - Edit answers (back to interview)
   - Start over (reset interview)

## Safe Pipeline Operations

### safePipelineOperations.js

Utility functions for safe phase and markdown operations.

**Functions:**
- `safeGenerateManualMarkdown(options)` — Generate with error handling
- `validatePhaseResponse(phaseId, response, phaseNumber)` — Validate input
- `safeValidatePhaseResponse(phaseId, response, phaseNumber)` — Safe validation

**Returns:**
```javascript
// Success
{ success: true, data: '# Manual markdown...' }

// Failure
{ success: false, error: PipelineError }
```

## Performance Considerations

- **State Updates:** Use `useCallback` to prevent re-renders
- **Manual Generation:** Runs only on phase completion or explicit regenerate
- **Markdown Parsing:** Lightweight string operations
- **TOC Extraction:** Regex parsing, very fast
- **No Database:** All data in React state (client-side only)

## Testing Guidance

### Test Phase Progression
- Start interview → verify landing page disappears
- Go through phases 0-11 → verify phase counter
- Test goNextPhase() at each phase
- Test goPrevPhase() to go backward

### Test Response Collection
- Enter text in phase → verify in state
- Edit existing phase → verify update
- Optional questions → verify separate storage

### Test Manual Generation
- Complete all 12 phases → verify manual generated
- Verify markdown formatting (headings, bullets, callouts)
- Verify author name in title
- Verify generated date in header

### Test Edge Cases
- Empty responses → should still generate (with gaps)
- Very long answers → should truncate/wrap
- Special characters → should be escaped
- Bullet-list detection → should format correctly
