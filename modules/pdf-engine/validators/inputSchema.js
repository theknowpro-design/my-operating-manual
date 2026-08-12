/**
 * Input Schema Validator for My Operating Manual PDF Engine
 * 
 * LOCKED ARCHITECTURE: This validator enforces that the PDF engine is used ONLY
 * for generating Operating Manual PDFs. Any attempt to generate PDFs for other
 * purposes (Money Maker, Profit Engine, generic HTML) will be rejected.
 * 
 * This is a security and data-integrity measure to prevent:
 * - Accidental legacy Money Maker PDF generation
 * - Generic document rendering from untrusted sources
 * - Brand/template confusion with other systems
 * 
 * @see exportManager.js (locked entry point)
 */

/**
 * Validate that input conforms to Operating Manual PDF requirements.
 * 
 * @param {string} markdownOrHtml - The content to render
 * @param {object} options - Rendering options
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateOperatingManualInput(markdownOrHtml = '', options = {}) {
  // RULE 1: Content must not be empty
  if (!markdownOrHtml || String(markdownOrHtml).trim().length === 0) {
    return {
      valid: false,
      error: '[Operating Manual PDF] Content cannot be empty'
    };
  }

  // RULE 2: Content must be string (markdown or HTML)
  if (typeof markdownOrHtml !== 'string') {
    return {
      valid: false,
      error: '[Operating Manual PDF] Content must be markdown or HTML string'
    };
  }

  // RULE 3: Reject only if content appears to be from Money Maker system
  // NOTE: Generic words like "profit", "money", "plan" are normal in Operating Manuals
  // Only flag if there's clear indication of Money Maker/Profit Engine system confusion
  const moneyMakerPatterns = [
    /money\s*maker.*app/i,        // Mentions the product name + app
    /profit\s*engine.*plan/i,     // Exact system identifier
  ];

  const contentLower = String(markdownOrHtml).toLowerCase();
  const moneyMakerMatch = moneyMakerPatterns.find(pattern => pattern.test(contentLower));
  
  if (moneyMakerMatch) {
    return {
      valid: false,
      error: `[Operating Manual PDF] Rejected: Content appears to be Money Maker/Profit Engine data`
    };
  }

  // RULE 4: Validate options.title (if provided)
  if (options.title !== undefined && typeof options.title !== 'string') {
    return {
      valid: false,
      error: '[Operating Manual PDF] options.title must be a string'
    };
  }

  // RULE 5: Force Operating Manual branding (cannot override)
  if (options.brand && options.brand !== 'My Operating Manual') {
    return {
      valid: false,
      error: '[Operating Manual PDF] Brand must be "My Operating Manual" (locked)'
    };
  }

  // RULE 6: Validate that logoUrl is NOT being overridden with unknown assets
  if (options.logoUrl && !options.logoUrl.includes('Teal Read Me Logo')) {
    return {
      valid: false,
      error: '[Operating Manual PDF] Logo must be Teal Read Me Logo (locked asset)'
    };
  }

  // RULE 7: Reject generic PDF generator options from Money Maker
  const forbiddenOptions = [
    'chartData',
    'nicheGraphs',
    'cockpitGraphs',
    'incomeGraphs',
    'monthlyProgressGraphs',
    'advancedTips',
    'realWorldScenarios',
    'actionPlan',
    'faqData',
  ];

  const foundForbidden = forbiddenOptions.find(opt => opt in options);
  if (foundForbidden) {
    return {
      valid: false,
      error: `[Operating Manual PDF] Rejected: "${foundForbidden}" is not supported in Operating Manual mode`
    };
  }

  // RULE 8: Validate subtitle (must be Operating Manual-related if provided)
  if (options.subtitle && typeof options.subtitle !== 'string') {
    return {
      valid: false,
      error: '[Operating Manual PDF] options.subtitle must be a string'
    };
  }

  // RULE 9: Metadata must be Operating Manual-focused keywords
  if (options.metadata && typeof options.metadata === 'object') {
    const forbiddenKeywords = ['profit', 'money', 'income', 'niche', 'business model', 'revenue'];
    
    // Handle keywords as array or string, reject other types
    let keywordsString = '';
    if (Array.isArray(options.metadata.keywords)) {
      keywordsString = options.metadata.keywords.join(' ').toLowerCase();
    } else if (typeof options.metadata.keywords === 'string') {
      keywordsString = options.metadata.keywords.toLowerCase();
    } else if (options.metadata.keywords !== undefined) {
      // Reject if keywords is not array, string, or undefined
      return {
        valid: false,
        error: '[Operating Manual PDF] Metadata keywords must be a string or array of strings'
      };
    }
    
    const isForbidden = forbiddenKeywords.some(kw => keywordsString.includes(kw));
    if (isForbidden) {
      return {
        valid: false,
        error: '[Operating Manual PDF] Metadata keywords must be Operating Manual-focused (locked)'
      };
    }
  }

  // RULE 10: Filename must not reference Money Maker/Profit
  if (options.filename && /profit|money|niche|income/i.test(options.filename)) {
    return {
      valid: false,
      error: '[Operating Manual PDF] Filename must not reference Money Maker terminology'
    };
  }

  // All validations passed
  return { valid: true };
}

/**
 * Throw an error if validation fails.
 * Use this in the locked entry point to enforce schema compliance.
 * 
 * @param {string} markdownOrHtml
 * @param {object} options
 * @throws {Error} if validation fails
 */
export function enforceOperatingManualSchema(markdownOrHtml = '', options = {}) {
  const result = validateOperatingManualInput(markdownOrHtml, options);
  
  if (!result.valid) {
    const error = new Error(result.error);
    error.code = 'OPERATING_MANUAL_SCHEMA_VIOLATION';
    throw error;
  }
}

/**
 * Check if provided options attempt to use legacy Money Maker features.
 * 
 * @param {object} options
 * @returns {string|null} error message if legacy features detected, null otherwise
 */
export function detectLegacyMoneyMakerOptions(options = {}) {
  const legacyOptions = {
    exportBrandedPdf: 'Use generateOperatingManualPdf() instead',
    exportProfitEnginePdf: 'Use generateOperatingManualPdf() instead',
    generateBrandedPdf: 'Use generateOperatingManualPdf() instead',
    createPdfExport: 'Use generateOperatingManualPdf() instead',
    plan: 'Operating Manual does not use "plan" structure',
    method: 'Operating Manual does not use "method" structure',
    niche: 'Operating Manual does not use "niche" structure',
  };

  for (const [key, message] of Object.entries(legacyOptions)) {
    if (key in options) {
      return `[Deprecated] ${message}`;
    }
  }

  return null;
}

export default {
  validateOperatingManualInput,
  enforceOperatingManualSchema,
  detectLegacyMoneyMakerOptions,
};
