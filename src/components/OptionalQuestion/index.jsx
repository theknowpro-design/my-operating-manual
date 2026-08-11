import { useId, useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import './OptionalQuestion.css'

export function OptionalQuestion({ question }) {
  const panelId = useId()
  const { optionalResponses, setOptionalResponse } = useAppState()
  const [open, setOpen] = useState(Boolean(optionalResponses[question.id]))
  const value = optionalResponses[question.id] || ''

  return (
    <div className={`optional-question ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="optional-question-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="optional-question-label">Optional: {question.prompt}</span>
        <span className="optional-question-chevron" aria-hidden="true">▾</span>
      </button>

      <div className="optional-question-panel" id={panelId}>
        <div className="optional-question-panel-inner">
          <div className="optional-question-body">
            <p className="optional-question-prompt">{question.prompt}</p>
            <textarea
              className="optional-question-input"
              value={value}
              placeholder={question.placeholder || 'Optional details…'}
              onChange={(event) => setOptionalResponse(question.id, event.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionalQuestion
