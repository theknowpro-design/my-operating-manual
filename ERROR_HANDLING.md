# Robust Error Handling System

This document describes the comprehensive error handling system added to the My Operating Manual pipeline.

## Overview

The error handling system provides:

1. **Unified error objects** — Structured `PipelineError` format across the app
2. **Safe fallback messages** — User-friendly error text (never shows stack traces)
3. **Logging hooks** — Captures errors for debugging without crashing
4. **Try-catch protection** — Each pipeline step wrapped with error handling
5. **Error UI component** — Displays errors with recovery options
6. **Fallback screen** — Shows when the pipeline encounters fatal errors

## Architecture

### 1. Error Handler Module (`modules/pipeline/errorHandler.js`)

Core error handling utilities:

- **`createPipelineError(options)`** — Create structured error objects
  - `code` — Error code (e.g., `PHASE_FAILED`, `GENERATION_FAILED`)
  - `message` — User-facing message (safe for UI)
  - `detail` — Developer detail (logged but not shown in UI)
  - `phaseNumber` — Which phase failed (if applicable)
  - `originalError` — Underlying error for debugging

- **`getFallbackMessage(code, phaseNumber)`** — Get safe message for error code
  - Prevents exposing sensitive information in the UI
  - Provides helpful guidance for users

- **`logPipelineError(error, context)`** — Log errors with context
  - Uses `window._pipelineErrorLogger` if available (for custom logging)
  - Falls back to `console.error` in development
  - Captures user agent, timestamp, and context

- **`safeExecute(fn, options)`** — Wrap async functions with error handling
  - Returns `{success, data, error}` instead of throwing
  - Automatically logs errors
  - Useful for wrapping pipeline steps

- **`isRecoverableError(error)`** — Check if error can be retried
  - Recoverable: `PHASE_FAILED`, `VALIDATION_FAILED`, `GENERATION_FAILED`, `STATE_SYNC_FAILED`
  - Non-recoverable: `PDF_EXPORT_FAILED`, `UNKNOWN_ERROR`

- **`formatErrorForDisplay(error)`** — Format error for safe UI display
  - Includes phase number if applicable
  - Safe for user consumption

### 2. State Management (`src/context/AppStateContext.jsx`)

Error state integrated into AppStateContext:

```javascript
const initialState = {
  view: 'landing',
  currentPhase: 0,
  responses: {},
  optionalResponses: {},
  manualMarkdown: '',
  isInterviewComplete: false,
  authorName: '',
  error: null,              // PipelineError object
  isLoading: false,         // Loading state for async operations
}
```

New handlers:

- **`setError(error)`** — Set error state
- **`resetError()`** — Clear error state
- **`setLoading(isLoading)`** — Set loading state

Protected pipeline steps:

- **`goNextPhase()`** — Wrapped with try-catch around markdown generation
- **`completeInterview()`** — Wrapped with try-catch for final generation
- **`regenerateManual()`** — Wrapped with try-catch for regeneration

### 3. Error Display Component (`src/components/ErrorDisplay.jsx`)

Renders structured errors with user-friendly messaging:

- Shows error title and message
- Collapsible technical details (for developers)
- Action buttons:
  - **Try Again** — Retry (if error is recoverable)
  - **Start Over** — Reset interview
  - **Contact Support** — Opens email client with pre-filled information

### 4. Pipeline Failed Screen (`src/components/PipelineFailedScreen.jsx`)

Full-screen fallback shown when an error occurs:

- Displays error with ErrorDisplay component
- Shows "What happened?" and "Next steps" guidance
- Encourages recovery actions

### 5. Safe Pipeline Utilities (`src/utils/safePipelineOperations.js`)

Helper functions for validating pipeline operations:

- **`safeGenerateManualMarkdown(options)`** — Safely generate markdown
- **`validatePhaseResponse(phaseId, response, phaseNumber)`** — Validate response data
- **`safeValidatePhaseResponse(...)`** — Safe validation wrapper

## Error Codes

| Code | Message | Recoverable | Context |
|------|---------|-------------|---------|
| `PHASE_FAILED` | Phase X encountered an error | Yes | goNextPhase() |
| `VALIDATION_FAILED` | Input could not be validated | Yes | Phase response validation |
| `GENERATION_FAILED` | Manual could not be generated | Yes | regenerateManual() |
| `PDF_EXPORT_FAILED` | PDF export failed | No | PDF engine |
| `MARKDOWN_GENERATION_FAILED` | Manual markdown generation failed | Yes | completeInterview() |
| `STATE_SYNC_FAILED` | State synchronization failed | Yes | State updates |
| `UNKNOWN_ERROR` | An unexpected error occurred | No | Catch-all |

## Integration Points

### In App.jsx

```javascript
function AppViews() {
  const { view, error } = useAppState()

  // Show error screen for unrecoverable errors
  if (error) {
    return <PipelineFailedScreen />
  }

  // Normal view rendering
  return <div>...</div>
}
```

### In Components

Use `resetError()` to dismiss errors:

```javascript
const { error, resetError } = useAppState()

return (
  <>
    <PipelineFailedScreen /> {/* Shown automatically if error */}
    {!error && <NormalUI />}
  </>
)
```

### In Custom Logging

Override error logging by setting `window._pipelineErrorLogger`:

```javascript
window._pipelineErrorLogger = (message, logEntry) => {
  // Send to your error tracking service (Sentry, LogRocket, etc.)
  captureException(logEntry)
}
```

## Error Flow

1. **Pipeline step executes** — e.g., `goNextPhase()`
2. **Try-catch catches error** — Creates structured `PipelineError`
3. **Error logged** — Via `logPipelineError()` with context
4. **Error stored in state** — `setState({ error })`
5. **AppViews checks error** — Renders `PipelineFailedScreen` if present
6. **User sees recovery UI** — With "Try Again", "Start Over", or "Contact Support"
7. **User chooses action** — `resetError()` clears and returns to normal flow

## Testing Error Handling

### Simulate an error in the browser console:

```javascript
// Trigger a phase error
const { setError, createPipelineError } = window.__appState
setError(createPipelineError({
  code: 'PHASE_FAILED',
  message: 'Test error',
  phaseNumber: 3,
}))
```

### Check error logs:

```javascript
// View error logs in console
// Look for "[Pipeline Error]" messages with structured data
```

### Override logging:

```javascript
window._pipelineErrorLogger = (msg, entry) => console.log('Custom:', entry)
```

## Best Practices

1. **Always use structured errors** — Use `createPipelineError()`, not `throw new Error()`
2. **Log before storing** — Call `logPipelineError()` with context
3. **Check recoverability** — Use `isRecoverableError()` to determine UI
4. **Safe messages** — Never expose stack traces or sensitive data in user-facing messages
5. **Provide context** — Include phase number, operation name, and other relevant data
6. **Test recovery** — Ensure errors can be dismissed and app returns to normal state

## Future Enhancements

- [ ] Persist errors to localStorage for post-crash debugging
- [ ] Add error tracking integration (Sentry, LogRocket)
- [ ] Implement exponential backoff retry logic
- [ ] Add A/B testing for error messaging
- [ ] Create error metrics dashboard
- [ ] Add offline error handling
