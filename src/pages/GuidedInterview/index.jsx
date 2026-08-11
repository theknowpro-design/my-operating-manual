import { useAppState } from '../../context/AppStateContext.jsx'
import { getPhaseByIndex } from '../../data/phases.js'
import ProgressBar from '../../components/ProgressBar/index.jsx'
import PhaseCard from '../../components/PhaseCard/index.jsx'
import NavigationButtons from '../../components/NavigationButtons/index.jsx'
import './GuidedInterview.css'

export function GuidedInterview() {
  const { currentPhase, authorName } = useAppState()
  const phase = getPhaseByIndex(currentPhase)

  if (!phase) return null

  return (
    <section className="guided-interview" aria-label="Guided interview">
      <ProgressBar />
      <p className="guided-interview-intro">
        {authorName
          ? `${authorName}, answer each phase in your own words. Optional questions deepen the manual.`
          : 'Answer each phase in your own words. Optional questions deepen the manual.'}
      </p>
      <PhaseCard key={phase.id} phase={phase} />
      <NavigationButtons />
    </section>
  )
}

export default GuidedInterview
