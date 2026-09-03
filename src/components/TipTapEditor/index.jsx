/**
 * TipTap WYSIWYG Editor Component
 * 
 * Hybrid Architecture:
 * - TipTap produces HTML internally
 * - HTML is converted to Markdown for storage
 * - ManualRenderer continues to render markdown
 * - PDF export continues using markdown → HTML pipeline
 * 
 * With Character Limits:
 * - Enforces per-phase character limits
 * - Blocks input beyond limit
 * - Shows warning at 80%
 * - Shows error at 100%
 */

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { htmlToMarkdown } from '../../utils/htmlToMarkdown.js'
import { markdownToHtml } from '../../utils/markdownToHtml.js'
import {
  characterCountFromMarkdown,
  getPhaseCharacterLimit,
  getCharacterLimitPercentage,
} from '../../utils/characterCountFromMarkdown.js'
import './TipTapEditor.css'

export function TipTapEditor({ value, onChange, placeholder, phaseId }) {
  const characterLimit = getPhaseCharacterLimit(phaseId)
  const currentCount = characterCountFromMarkdown(value)
  const percentage = getCharacterLimitPercentage(value, phaseId)
  const isWarning = percentage >= 80 && percentage < 100
  const isError = percentage >= 100

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
    ],
    content: markdownToHtml(value),
    onUpdate: ({ editor }) => {
      // Convert TipTap HTML back to markdown for storage
      const html = editor.getHTML()
      const markdown = htmlToMarkdown(html)

      // Check character limit before allowing update
      const newCount = characterCountFromMarkdown(markdown)
      if (newCount <= characterLimit) {
        onChange(markdown)
      }
      // If exceeds limit, silently reject the update (no state change)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-editor-wrapper">
      <div className="tiptap-header">
        <div className="tiptap-toolbar">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`tiptap-toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
            aria-label="Toggle bold"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`tiptap-toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
            aria-label="Toggle italic"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`tiptap-toolbar-button ${editor.isActive('underline') ? 'is-active' : ''}`}
            aria-label="Toggle underline"
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>

          <div className="tiptap-toolbar-divider" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`tiptap-toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
            aria-label="Toggle heading 1"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`tiptap-toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
            aria-label="Toggle heading 2"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`tiptap-toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            aria-label="Toggle heading 3"
            title="Heading 3"
          >
            H3
          </button>

          <div className="tiptap-toolbar-divider" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`tiptap-toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            aria-label="Toggle bullet list"
            title="Bullet list"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`tiptap-toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            aria-label="Toggle ordered list"
            title="Ordered list"
          >
            1.
          </button>

          <div className="tiptap-toolbar-divider" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="tiptap-toolbar-button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="tiptap-toolbar-button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        <div className={`tiptap-character-counter ${isError ? 'is-error' : isWarning ? 'is-warning' : ''}`}>
          <span className="tiptap-counter-text">
            {currentCount.toLocaleString()} / {characterLimit.toLocaleString()} characters
          </span>
          {isError && <span className="tiptap-counter-message">Limit exceeded</span>}
          {isWarning && <span className="tiptap-counter-message">Nearing limit</span>}
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="tiptap-editor-content"
        placeholder={placeholder}
      />
    </div>
  )
}

export default TipTapEditor
