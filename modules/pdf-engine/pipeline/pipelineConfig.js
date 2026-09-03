/**
 * Pipeline feature flags for PDF generation orchestration.
 * Pure config — no rendering or HTML logic.
 */

export const pipelineConfig = {
  enableCoverPage: true,
  fallbackOnError: true,
};

export default pipelineConfig;
