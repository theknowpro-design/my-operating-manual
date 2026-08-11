import { useAppState } from '../../context/AppStateContext.jsx'
import { getOptionalQuestionsForPhase } from '../../data/optionalQuestions.js'
import OptionalQuestion from '../OptionalQuestion/index.jsx'
import './PhaseCard.css'

export function PhaseCard({ phase }) {
  const { responses, setResponse } = useAppState()
  const value = responses[phase.id] || ''
  const optionals = getOptionalQuestionsForPhase(phase.id)

  return (
    <section className="phase-card" aria-labelledby={`phase-title-${phase.id}`}>
      <div className="phase-card-eyebrow">Phase {phase.number}</div>
      <h2 className="phase-card-title" id={`phase-title-${phase.id}`}>
        {phase.title}
      </h2>
      <p className="phase-card-description">{phase.description}</p>

      {phase.callout ? (
        <aside className="phase-card-callout" aria-label="Guidance">
          {phase.callout}
        </aside>
      ) : null}

      <label className="phase-card-question" htmlFor={`phase-input-${phase.id}`}>
        {phase.question}
      </label>
      <textarea
        id={`phase-input-${phase.id}`}
        className="phase-card-input"
        value={value}
        placeholder={phase.placeholder}
        onChange={(event) => setResponse(phase.id, event.target.value)}
        rows={7}
        required
      />

      {optionals.length > 0 ? (
        <div className="phase-card-optionals">
          <div className="phase-card-optionals-label">Optional deepening</div>
          {optionals.map((question) => (
            <OptionalQuestion key={question.id} question={question} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default PhaseCard
