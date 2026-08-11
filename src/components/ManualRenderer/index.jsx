import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { slugify } from '../../utils/manualGenerator.js'
import './ManualRenderer.css'

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const id = slugify(text.replace(/<[^>]+>/g, ''))
      return `<h${depth} id="${id}">${text}</h${depth}>\n`
    },
  },
})

export function ManualRenderer({ markdown }) {
  const html = useMemo(() => {
    if (!markdown?.trim()) return ''
    const raw = marked.parse(markdown)
    return DOMPurify.sanitize(raw)
  }, [markdown])

  if (!html) {
    return (
      <article className="manual-renderer">
        <p className="manual-renderer-empty">
          Your operating manual will appear here once the interview is complete.
        </p>
      </article>
    )
  }

  return (
    <article
      className="manual-renderer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default ManualRenderer
