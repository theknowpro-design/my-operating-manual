/**
 * PDF Engine Validators
 * 
 * This directory contains validation logic for locked PDF engine architecture.
 * All inputs to the PDF engine must pass validation before rendering.
 */

export { 
  validateOperatingManualInput,
  enforceOperatingManualSchema,
  detectLegacyMoneyMakerOptions,
} from './inputSchema.js';
