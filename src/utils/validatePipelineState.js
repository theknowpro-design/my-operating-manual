/**
 * Pipeline State Type Validation Utility
 * 
 * Ensures all pipeline state mutations receive valid string types.
 * Prevents null, undefined, objects, arrays, and other invalid types from entering the pipeline.
 */

/**
 * Validate that a value is a valid string for pipeline state
 * 
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field being validated (for error messages)
 * @returns {object} { isValid: boolean, error?: string, sanitized?: string }
 */
export function validatePipelineString(value, fieldName = 'value') {
  // Allow empty string
  if (value === '') {
    return { isValid: true, sanitized: '' }
  }

  // Reject null and undefined
  if (value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} cannot be null or undefined`,
    }
  }

  // Reject objects (including arrays)
  if (typeof value === 'object') {
    return {
      isValid: false,
      error: `${fieldName} must be a string, not ${Array.isArray(value) ? 'array' : 'object'}`,
    }
  }

  // Reject numbers, booleans, and other non-string types
  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: `${fieldName} must be a string, received ${typeof value}`,
    }
  }

  // Valid string
  return { isValid: true, sanitized: String(value) }
}

/**
 * Validate response value for pipeline state
 * @param {any} value - Response value
 * @returns {object} { isValid: boolean, error?: string }
 */
export function validateResponseValue(value) {
  return validatePipelineString(value, 'Response')
}

/**
 * Validate author name for pipeline state
 * @param {any} value - Author name
 * @returns {object} { isValid: boolean, error?: string }
 */
export function validateAuthorName(value) {
  return validatePipelineString(value, 'Author name')
}

/**
 * Validate phase number
 * @param {any} value - Phase number
 * @returns {object} { isValid: boolean, error?: string }
 */
export function validatePhaseNumber(value) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    return {
      isValid: false,
      error: 'Phase must be a non-negative integer',
    }
  }
  return { isValid: true }
}

export default {
  validatePipelineString,
  validateResponseValue,
  validateAuthorName,
  validatePhaseNumber,
}
