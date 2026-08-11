import { useAppState } from '../../context/AppStateContext.jsx'
import './ProgressBar.css'

export function ProgressBar() {
  const { currentPhase, totalPhases, isInterviewComplete, progress } = useAppState()
  const displayPhase = Math.min(currentPhase + 1, totalPhases)
  const width = isInterviewComplete ? 100 : Math.max(0, Math.min(100, progress))

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
      aria-label="Interview progress"
    >
      <div className="progress-bar-meta">
        <span className="progress-bar-label">
          {isInterviewComplete
            ? 'Interview complete'
            : `Phase ${displayPhase} of ${totalPhases}`}
        </span>
        <span>{Math.round(width)}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${isInterviewComplete ? 'is-complete' : ''}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
