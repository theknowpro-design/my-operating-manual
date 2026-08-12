import { useAppState } from '../../context/AppStateContext.jsx'
import { Button } from '../Buttons/index.jsx'

/**
 * ResetButton
 * 
 * Clears all interview state and returns to the landing page.
 * Requires user confirmation before proceeding.
 */
export function ResetButton({ className = '', variant = 'ghost' }) {
  const { resetInterview, setView } = useAppState()

  const handleReset = () => {
    if (window.confirm('Are you sure? This will clear all your answers.')) {
      resetInterview()
      setView('landing')
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleReset}
      className={className}
      aria-label="Start over and clear all answers"
    >
      Start Over
    </Button>
  )
}

export default ResetButton
