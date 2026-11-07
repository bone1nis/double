import { useRef, useState } from 'react'
import { MAX_DESCRIPTION_LENGTH, MAX_TODO_LENGTH } from '@/entities/todo'
import type { TodoContent } from '@/entities/todo'
import { getDraftErrors, resolveDraft } from './draft'

const isSingleLine = (element: HTMLTextAreaElement): boolean => {
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
  return Number.isNaN(lineHeight) || element.scrollHeight < lineHeight * 2
}

export const useTodoEditor = (
  content: TodoContent,
  onSave: (patch: Partial<TodoContent>) => void,
) => {
  const [text, setText] = useState(content.text)
  const [description, setDescription] = useState(content.description)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const { textError, descriptionError } = getDraftErrors({ text, description })

  const commit = () => {
    const result = resolveDraft(content, { text, description })
    if (!result.ok) return
    setText(result.value.text)
    setDescription(result.value.description)
    if (Object.keys(result.patch).length > 0) onSave(result.patch)
  }

  return {
    title: {
      value: text,
      error: textError,
      count: text.trim().length,
      limit: MAX_TODO_LENGTH,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value.replace(/\n/g, ' '))
      },
      textareaRef: titleRef,
      onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          event.currentTarget.blur()
        }
        if (event.key === 'ArrowDown' && isSingleLine(event.currentTarget)) {
          event.preventDefault()
          descriptionRef.current?.focus()
        }
      },
      onBlur: commit,
    },
    description: {
      value: description,
      error: descriptionError,
      count: description.trim().length,
      limit: MAX_DESCRIPTION_LENGTH,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
      },
      textareaRef: descriptionRef,
      onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const { selectionStart, selectionEnd } = event.currentTarget
        if (event.key !== 'ArrowUp' || selectionStart !== 0 || selectionEnd !== 0) return
        event.preventDefault()
        const title = titleRef.current
        title?.focus()
        title?.setSelectionRange(title.value.length, title.value.length)
      },
      onBlur: commit,
    },
  }
}
