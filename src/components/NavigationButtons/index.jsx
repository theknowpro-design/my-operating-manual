import { useAppState } from '../../context/AppStateContext.jsx'
import { getPhaseByIndex } from '../../data/phases.js'
import { Button } from '../Buttons/index.jsx'
import { smoothScrollToTop } from '../../utils/scrollHelpers.js'
import './NavigationButtons.css'

export function NavigationButtons() {
  const {
    currentPhase,
    totalPhases,
    responses,
    goNextPhase,
    goPrevPhase,
    completeInterview,
  } = useAppState()

  const phase = getPhaseByIndex(currentPhase)
  const hasAnswer = Boolean(String(responses[phase?.id] || '').trim())
  const isLast = currentPhase >= totalPhases - 1

  const handleNext = () => {
    if (!hasAnswer) return
    if (isLast) completeInterview()
    else goNextPhase()
    smoothScrollToTop()
  }

  return (
    <div className="navigation-buttons">
      <Button
        variant="secondary"
        onClick={() => {
          goPrevPhase()
          smoothScrollToTop()
        }}
        disabled={currentPhase === 0}
      >
        Back
      </Button>

      <div className="navigation-buttons-right">
        {!hasAnswer ? (
          <span className="sr-only" role="status">
            Answer the main question to continue
          </span>
        ) : null}
        <Button variant="primary" onClick={handleNext} disabled={!hasAnswer}>
          {isLast ? 'Generate Manual' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

export default NavigationButtons
