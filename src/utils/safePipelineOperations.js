/**
 * Safe pipeline operation utilities
 * 
 * These wrap critical pipeline steps with error handling, logging,
 * and structured error objects for use throughout the app.
 */

import {
  createPipelineError,
  logPipelineError,
  safeExecute,
} from '../../modules/pipeline/errorHandler.js'
import { generateManualMarkdown } from './manualGenerator.js'

/**
 * Safely generate manual markdown with error handling.
 * 
 * @param {object} options
 * @param {object} [options.responses]
 * @param {object} [options.optionalResponses]
 * @param {string} [options.authorName]
 * @returns {Promise<{success: boolean, data?: string, error?: PipelineError}>}
 */
export async function safeGenerateManualMarkdown(options = {}) {
  return safeExecute(
    async () => {
      return generateManualMarkdown(options)
    },
    {
      code: 'MARKDOWN_GENERATION_FAILED',
      message: 'Could not generate your manual. Please try again.',
    }
  )
}

/**
 * Validate phase response data.
 * 
 * @param {string} phaseId - Phase ID
 * @param {string} response - Phase response text
 * @param {number} phaseNumber - Phase number
 * @returns {{valid: boolean, error?: PipelineError}}
 */
export function validatePhaseResponse(phaseId, response, phaseNumber) {
  // Check if response is a string
  if (typeof response !== 'string' && response !== '') {
    return {
      valid: false,
      error: createPipelineError({
        code: 'VALIDATION_FAILED',
        message: `Phase ${phaseNumber}: Response must be text`,
        phaseNumber,
        detail: `Expected string, got ${typeof response}`,
      }),
    }
  }

  // Note: We don't enforce non-empty responses — users can skip phases
  // This allows flexible interview completion

  return { valid: true }
}

/**
 * Safely update phase response.
 * 
 * Validates the response before returning.
 * 
 * @param {string} phaseId - Phase ID
 * @param {string} response - Response text
 * @param {number} phaseNumber - Phase number
 * @returns {{success: boolean, error?: PipelineError}}
 */
export function safeValidatePhaseResponse(phaseId, response, phaseNumber) {
  try {
    const { valid, error } = validatePhaseResponse(phaseId, response, phaseNumber)
    
    if (!valid) {
      logPipelineError(error, {
        step: 'safeValidatePhaseResponse',
        phaseId,
        phaseNumber,
      })
      return { success: false, error }
    }

    return { success: true }
  } catch (err) {
    const error = createPipelineError({
      code: 'VALIDATION_FAILED',
      message: `Phase ${phaseNumber}: Validation error`,
      phaseNumber,
      detail: err?.message || '',
      originalError: err,
    })
    logPipelineError(error, { step: 'safeValidatePhaseResponse', err })
    return { success: false, error }
  }
}
