/** Optional follow-up questions keyed by phase id */

export const optionalQuestions = {
  identity: [
    {
      id: 'identity-team',
      prompt: 'Who do you work with most closely right now?',
      placeholder: 'Teams, partners, stakeholders…',
    },
    {
      id: 'identity-context',
      prompt: 'What context should people know before collaborating with you?',
      placeholder: 'Timezone, dual roles, current priorities…',
    },
  ],
  values: [
    {
      id: 'values-tradeoff',
      prompt: 'Which value do you protect even when it costs speed or comfort?',
      placeholder: 'Describe a real trade-off…',
    },
  ],
  strengths: [
    {
      id: 'strengths-proof',
      prompt: 'Share a recent example where a strength clearly showed up.',
      placeholder: 'Situation → action → impact…',
    },
    {
      id: 'strengths-delegate',
      prompt: 'What should others not expect you to own?',
      placeholder: 'Areas you prefer to partner on or hand off…',
    },
  ],
  growth: [
    {
      id: 'growth-signal',
      prompt: 'What early signal tells you a growth edge is active?',
      placeholder: 'Body cues, language patterns, friction…',
    },
  ],
  communication: [
    {
      id: 'communication-channels',
      prompt: 'Preferred channels for updates, decisions, and urgency?',
      placeholder: 'Email / Slack / doc / call…',
    },
    {
      id: 'communication-misread',
      prompt: 'What do people commonly misread about your communication?',
      placeholder: 'e.g. Brevity ≠ frustration…',
    },
  ],
  'working-style': [
    {
      id: 'working-rituals',
      prompt: 'Any rituals or setup that help you do your best work?',
      placeholder: 'Standing desk, agenda templates, weekly review…',
    },
  ],
  decisions: [
    {
      id: 'decisions-reversible',
      prompt: 'How do you treat reversible vs irreversible decisions?',
      placeholder: 'Speed vs alignment thresholds…',
    },
  ],
  feedback: [
    {
      id: 'feedback-public',
      prompt: 'When is public feedback okay, and when should it stay private?',
      placeholder: 'Your rules of thumb…',
    },
  ],
  trust: [
    {
      id: 'trust-repair',
      prompt: 'If trust dips, what helps repair it with you?',
      placeholder: 'Acknowledgment, clarity, changed behavior…',
    },
  ],
  boundaries: [
    {
      id: 'boundaries-exceptions',
      prompt: 'When are exceptions to your boundaries okay?',
      placeholder: 'Incidents, launches, personal emergencies…',
    },
  ],
  support: [
    {
      id: 'support-manager',
      prompt: 'What does great support from a manager or peer look like?',
      placeholder: 'Air cover, pairing, decision rights…',
    },
  ],
  'working-with-me': [
    {
      id: 'working-first-week',
      prompt: 'What should a new collaborator do in the first week with you?',
      placeholder: 'Read this manual, schedule a working styles chat…',
    },
  ],
}

export function getOptionalQuestionsForPhase(phaseId) {
  return optionalQuestions[phaseId] || []
}
