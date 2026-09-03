import { Button } from './Buttons/index.jsx'
import './ErrorDisplay.css'

/**
 * ErrorDisplay
 * 
 * Shows structured pipeline errors with safe, user-friendly messaging.
 * Provides actions for recovery (retry, reset, contact support).
 * 
 * @param {object} props
 * @param {object} props.error - PipelineError object
 * @param {Function} [props.onRetry] - Handler for retry button
 * @param {Function} [props.onReset] - Handler for reset/start over button
 * @param {boolean} [props.isRecoverable] - Whether the error can be retried
 */
export function ErrorDisplay({
  error,
  onRetry,
  onReset,
  isRecoverable = true,
}) {
  if (!error) return null

  const showRetry = isRecoverable && onRetry
  const showReset = onReset

  return (
    <div className="error-display" role="alert" aria-live="assertive">
      <div className="error-display-header">
        <div className="error-display-icon" aria-hidden="true">
          ⚠️
        </div>
        <div className="error-display-content">
          <h2 className="error-display-title">
            {error.phaseNumber
              ? `Phase ${error.phaseNumber} Error`
              : 'An Error Occurred'}
          </h2>
          <p className="error-display-message">{error.message}</p>
        </div>
      </div>

      {error.detail && (
        <details className="error-display-details">
          <summary>Technical Details</summary>
          <pre className="error-display-code">{error.detail}</pre>
        </details>
      )}

      <div className="error-display-actions">
        {showRetry && (
          <Button variant="primary" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {showReset && (
          <Button variant="ghost" onClick={onReset}>
            Start Over
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            const subject = encodeURIComponent(
              `Error: ${error.code} at ${error.timestamp}`
            )
            const body = encodeURIComponent(
              `I encountered an error:\n\n${error.message}\n\nDetails: ${error.detail}`
            )
            window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`
          }}
        >
          Contact Support
        </Button>
      </div>
    </div>
  )
}

export default ErrorDisplay
