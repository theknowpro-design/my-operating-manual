/**
 * Unified error handling for the My Operating Manual pipeline.
 * 
 * Provides structured error objects, safe fallback messages,
 * and logging hooks for graceful error recovery.
 */

/**
 * Structured error object for pipeline failures.
 * 
 * @typedef {object} PipelineError
 * @property {string} code - Error code (e.g. 'PHASE_FAILED', 'VALIDATION_FAILED')
 * @property {string} message - User-facing error message (safe for UI)
 * @property {string} [detail] - Developer-facing detail (logged but not shown)
 * @property {number} [phaseNumber] - Which phase failed (if applicable)
 * @property {string} [phaseName] - Phase name (if applicable)
 * @property {Error} [originalError] - Underlying error for debugging
 * @property {string} [timestamp] - ISO timestamp when error occurred
 */

/**
 * Create a structured pipeline error.
 * 
 * @param {object} options
 * @param {string} options.code - Error code
 * @param {string} options.message - User-facing message
 * @param {string} [options.detail] - Developer detail
 * @param {number} [options.phaseNumber] - Phase number
 * @param {string} [options.phaseName] - Phase name
 * @param {Error} [options.originalError] - Underlying error
 * @returns {PipelineError}
 */
export function createPipelineError({
  code = 'UNKNOWN_ERROR',
  message = 'An unexpected error occurred',
  detail = '',
  phaseNumber = null,
  phaseName = '',
  originalError = null,
} = {}) {
  return {
    code,
    message,
    detail: detail || (originalError?.message || ''),
    phaseNumber,
    phaseName,
    originalError,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Get a safe fallback message for a known error code.
 * 
 * @param {string} code - Error code
 * @param {number} [phaseNumber] - Phase number (optional)
 * @returns {string}
 */
export function getFallbackMessage(code, phaseNumber = null) {
  const messages = {
    PHASE_FAILED: `Phase ${phaseNumber || '?'} encountered an error. Please try again or contact support.`,
    VALIDATION_FAILED: 'Your input could not be validated. Please check your answers and try again.',
    GENERATION_FAILED: 'The manual could not be generated. Please try again.',
    PDF_EXPORT_FAILED: 'PDF export failed. Please try downloading as text or printing instead.',
    MARKDOWN_GENERATION_FAILED: 'The manual markdown could not be generated. Try refreshing and restarting.',
    STATE_SYNC_FAILED: 'State synchronization failed. Your progress may not be saved.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try refreshing the page.',
  }

  return messages[code] || messages.UNKNOWN_ERROR
}

/**
 * Error logging hook for capturing errors in development and production.
 * 
 * Can be overridden by setting `window._pipelineErrorLogger`.
 * 
 * @param {PipelineError} error - Structured pipeline error
 * @param {object} [context] - Additional context (phase, state, etc.)
 */
export function logPipelineError(error, context = {}) {
  const logger = window._pipelineErrorLogger || console.error

  const logEntry = {
    code: error.code,
    message: error.message,
    detail: error.detail,
    phaseNumber: error.phaseNumber,
    phaseName: error.phaseName,
    timestamp: error.timestamp,
    context,
    userAgent: navigator.userAgent,
  }

  logger('[Pipeline Error]', logEntry)

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `%c[Pipeline] ${error.code}: ${error.message}`,
      'color: #d32f2f; font-weight: bold;',
      error.detail,
      context
    )
  }
}

/**
 * Wrap an async function with error handling and logging.
 * 
 * Returns a success/error result object instead of throwing.
 * Useful for wrapping pipeline steps.
 * 
 * @template T
 * @param {Function} fn - Async function to wrap
 * @param {object} [options]
 * @param {string} [options.code] - Error code if fn fails
 * @param {string} [options.message] - Fallback error message
 * @param {number} [options.phaseNumber] - Phase number for context
 * @param {string} [options.phaseName] - Phase name for context
 * @returns {Promise<{success: boolean, data?: T, error?: PipelineError}>}
 */
export async function safeExecute(fn, options = {}) {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (err) {
    const error = createPipelineError({
      code: options.code || 'UNKNOWN_ERROR',
      message: options.message || getFallbackMessage(options.code),
      phaseNumber: options.phaseNumber,
      phaseName: options.phaseName,
      originalError: err,
    })

    logPipelineError(error, { fnName: fn.name, options })

    return { success: false, error }
  }
}

/**
 * Check if an error is recoverable (user can retry).
 * 
 * @param {PipelineError} error
 * @returns {boolean}
 */
export function isRecoverableError(error) {
  const recoverableCodes = [
    'PHASE_FAILED',
    'VALIDATION_FAILED',
    'GENERATION_FAILED',
    'MARKDOWN_GENERATION_FAILED',
    'STATE_SYNC_FAILED',
  ]
  return recoverableCodes.includes(error.code)
}

/**
 * Format error for display in UI.
 * 
 * Returns safe, user-friendly text (never shows stack traces or sensitive data).
 * 
 * @param {PipelineError} error
 * @returns {string}
 */
export function formatErrorForDisplay(error) {
  if (!error) return 'An unknown error occurred.'

  let text = error.message

  if (error.phaseNumber) {
    text = `Phase ${error.phaseNumber}: ${text}`
  }

  return text
}
