import { validateTodoDescription, validateTodoText } from '@/entities/todo'
import type { TodoContent } from '@/entities/todo'

export interface DraftErrors {
  textError: string | null
  descriptionError: string | null
}

export const getDraftErrors = (draft: TodoContent): DraftErrors => {
  const text = validateTodoText(draft.text)
  const description = validateTodoDescription(draft.description)
  return {
    textError: text.ok ? null : text.error,
    descriptionError: description.ok ? null : description.error,
  }
}

export type DraftResult =
  | { ok: true; value: TodoContent; patch: Partial<TodoContent> }
  | { ok: false; textError: string | null; descriptionError: string | null }

export const resolveDraft = (current: TodoContent, draft: TodoContent): DraftResult => {
  const text = validateTodoText(draft.text)
  const description = validateTodoDescription(draft.description)
  if (!text.ok || !description.ok) {
    return {
      ok: false,
      textError: text.ok ? null : text.error,
      descriptionError: description.ok ? null : description.error,
    }
  }
  const value = { text: text.value, description: description.value }
  const patch: Partial<TodoContent> = {}
  if (value.text !== current.text) patch.text = value.text
  if (value.description !== current.description) patch.description = value.description
  return { ok: true, value, patch }
}
