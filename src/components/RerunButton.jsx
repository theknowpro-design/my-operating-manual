import { useAppState } from '../../context/AppStateContext.jsx'
import { Button } from '../Buttons/index.jsx'

/**
 * RerunButton
 * 
 * Regenerates the operating manual using the latest interview data.
 * Useful when you've edited your answers and want to see the updated output.
 */
export function RerunButton({ className = '', variant = 'secondary' }) {
  const { regenerateManual } = useAppState()

  return (
    <Button
      variant={variant}
      onClick={regenerateManual}
      className={className}
      aria-label="Regenerate manual with current answers"
    >
      Rerun Pipeline
    </Button>
  )
}

export default RerunButton
