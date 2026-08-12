import { useAppState } from '../context/AppStateContext.jsx'
import ErrorDisplay from './ErrorDisplay.jsx'
import { Button } from './Buttons/index.jsx'
import { isRecoverableError } from '../../modules/pipeline/errorHandler.js'
import './PipelineFailedScreen.css'

/**
 * PipelineFailedScreen
 * 
 * Fallback UI shown when the pipeline encounters an unrecoverable error.
 * Displays the error message and provides options to recover.
 */
export function PipelineFailedScreen() {
  const { error, resetError, resetInterview, setView } = useAppState()

  if (!error) return null

  const recoverable = isRecoverableError(error)

  const handleRetry = () => {
    resetError()
  }

  const handleReset = () => {
    resetInterview()
    setView('landing')
    resetError()
  }

  return (
    <div className="pipeline-failed-screen">
      <div className="pipeline-failed-container">
        <ErrorDisplay
          error={error}
          onRetry={recoverable ? handleRetry : null}
          onReset={handleReset}
          isRecoverable={recoverable}
        />

        <div className="pipeline-failed-info">
          <h3>What happened?</h3>
          <p>
            The operation encountered an issue. Your answers are stored in your browser session.
          </p>

          <h3>Next steps:</h3>
          <ul>
            {recoverable && (
              <li>
                Dismiss error to return to where you were and try again. The issue might be temporary.
              </li>
            )}
            {!recoverable && (
              <li>
                Start over with a fresh interview to begin again.
              </li>
            )}
            <li>Check your browser console for detailed error logs</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PipelineFailedScreen
