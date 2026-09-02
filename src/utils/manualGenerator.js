import { phases } from '../data/phases.js'
import { getOptionalQuestionsForPhase } from '../data/optionalQuestions.js'
import { formatGeneratedLabel } from './formatTimestamp.js'

function splitIntoBullets(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length <= 1) return null

  const bulletLike = lines.every((line) => /^[-*•\d]+[.)]\s+/.test(line) || line.length < 120)
  if (!bulletLike) return null

  return lines.map((line) => line.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, ''))
}

function formatBody(text) {
  const bullets = splitIntoBullets(text)
  if (bullets) {
    return bullets.map((item) => `- ${item}`).join('\n')
  }
  return String(text || '').trim()
}

/**
 * Convert interview responses into structured markdown for ManualRenderer + PDF.
 */
export function generateManualMarkdown({
  responses = {},
  optionalResponses = {},
  authorName = '',
  generatedAt = new Date(),
} = {}) {
  const titleName = authorName?.trim() || 'My'
  const lines = [
    `# ${titleName === 'My' ? 'My Operating Manual' : `${titleName}'s Operating Manual`}`,
    '',
    `> A living guide to how I work, communicate, and collaborate. ${formatGeneratedLabel(generatedAt)}.`,
    '',
    '---',
    '',
  ]

  phases.forEach((phase) => {
    const answer = String(responses[phase.id] || '').trim()
    if (!answer) return

    lines.push(`## ${phase.number}. ${phase.title}`)
    lines.push('')
    if (phase.callout) {
      lines.push(`> **Note:** ${phase.callout}`)
      lines.push('')
    }
    lines.push(formatBody(answer))
    lines.push('')

    const optionals = getOptionalQuestionsForPhase(phase.id)
    optionals.forEach((item) => {
      const optionalAnswer = String(optionalResponses[item.id] || '').trim()
      if (!optionalAnswer) return
      lines.push(`### ${item.prompt}`)
      lines.push('')
      lines.push(formatBody(optionalAnswer))
      lines.push('')
    })
  })

  const closing = String(responses['working-with-me'] || '').trim()
  if (closing) {
    lines.push('## Quick Reference')
    lines.push('')
    lines.push('Use the points above as the shared contract for working together. Revisit this manual when roles, constraints, or collaboration patterns change.')
    lines.push('')
  }

  return lines.join('\n').trim() + '\n'
}

/**
 * Extract TOC headings from generated markdown.
 */
export function extractTocFromMarkdown(markdown) {
  const toc = []
  String(markdown || '')
    .split(/\r?\n/)
    .forEach((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
      if (!match) return
      const level = match[1].length
      // Remove markdown formatting: bold (**), italic (*), code (`)
      const title = match[2]
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .trim()
      const id = slugify(title)
      toc.push({ level, title, id })
    })
  return toc
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
