/** 12-phase guided interview for My Operating Manual */

export const phases = [
  {
    id: 'identity',
    number: 1,
    title: 'Identity & Role',
    description: 'Anchor who you are and the roles you play at work and beyond.',
    question: 'How would you introduce yourself and the roles you currently hold?',
    placeholder: 'e.g. I’m a product lead who straddles strategy and hands-on delivery…',
    callout: 'Lead with how you want others to understand your context.',
  },
  {
    id: 'values',
    number: 2,
    title: 'Values & Principles',
    description: 'Name the non-negotiables that shape how you show up.',
    question: 'What values and principles guide your decisions day to day?',
    placeholder: 'e.g. Clarity over speed, candor with kindness, ownership…',
    callout: 'Think about trade-offs you consistently make.',
  },
  {
    id: 'strengths',
    number: 3,
    title: 'Strengths & Superpowers',
    description: 'Highlight where you create outsized value.',
    question: 'What are you especially good at, and when do people seek you out?',
    placeholder: 'e.g. Framing messy problems, facilitating hard conversations…',
    callout: 'Include both skills and natural tendencies.',
  },
  {
    id: 'growth',
    number: 4,
    title: 'Growth Edges',
    description: 'Be honest about blind spots and active development areas.',
    question: 'Where are you stretching, and what help do you want with those edges?',
    placeholder: 'e.g. I over-index on details when stakes feel high…',
    callout: 'Growth edges invite collaboration, not judgment.',
  },
  {
    id: 'communication',
    number: 5,
    title: 'Communication Style',
    description: 'Explain how you prefer to send and receive information.',
    question: 'How do you prefer to communicate, and how should others interpret your style?',
    placeholder: 'e.g. Direct written updates; I ask a lot of questions when I’m engaged…',
    callout: 'Cover async vs sync, tone, and response timing.',
  },
  {
    id: 'working-style',
    number: 6,
    title: 'Working Style & Energy',
    description: 'Describe how you plan, focus, and manage energy.',
    question: 'What does a productive workday look like for you?',
    placeholder: 'e.g. Deep work mornings, collaborative afternoons, buffer before meetings…',
    callout: 'Include peak hours and context-switching preferences.',
  },
  {
    id: 'decisions',
    number: 7,
    title: 'Decision Making',
    description: 'Share how you prioritize and make calls under uncertainty.',
    question: 'How do you make decisions, and what information do you need?',
    placeholder: 'e.g. I start with the outcome, then constraints, then options…',
    callout: 'Note what slows you down or speeds you up.',
  },
  {
    id: 'feedback',
    number: 8,
    title: 'Feedback Preferences',
    description: 'Set expectations for giving and receiving feedback.',
    question: 'How do you prefer to give and receive feedback?',
    placeholder: 'e.g. Specific examples, private first, then shared learnings…',
    callout: 'Include cadence and emotional preferences.',
  },
  {
    id: 'trust',
    number: 9,
    title: 'Trust & Collaboration',
    description: 'Clarify what builds or erodes trust with you.',
    question: 'What builds trust with you, and what quickly erodes it?',
    placeholder: 'e.g. Follow-through builds trust; surprises late in the process erode it…',
    callout: 'Be concrete — behaviors beat adjectives.',
  },
  {
    id: 'boundaries',
    number: 10,
    title: 'Boundaries & Constraints',
    description: 'Surface limits that protect your best work.',
    question: 'What boundaries and constraints should others respect?',
    placeholder: 'e.g. No Slack after 7pm; I need agendas for meetings over 30 minutes…',
    callout: 'Boundaries make collaboration more sustainable.',
  },
  {
    id: 'support',
    number: 11,
    title: 'How to Help Me',
    description: 'Tell people how to support you when it counts.',
    question: 'When you’re stuck or overloaded, what help actually helps?',
    placeholder: 'e.g. Help me prioritize ruthlessly; offer a sounding board before solutions…',
    callout: 'Make it easy for allies to show up well.',
  },
  {
    id: 'working-with-me',
    number: 12,
    title: 'Working With Me',
    description: 'Close with a practical “how to work with me” summary.',
    question: 'If someone only remembered five things about working with you, what should they be?',
    placeholder: 'e.g. 1) Write it down 2) Push back early 3) Protect focus blocks…',
    callout: 'This becomes the quick-reference section of your manual.',
  },
]

export const TOTAL_PHASES = phases.length

export function getPhaseByIndex(index) {
  return phases[index] || null
}

export function getPhaseById(id) {
  return phases.find((phase) => phase.id === id) || null
}
