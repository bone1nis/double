import { useState } from 'react'
import {
  DEFAULT_META,
  MAX_DESCRIPTION_LENGTH,
  MAX_TODO_LENGTH,
  validateTodoText,
} from '@/entities/todo'
import type { Priority, TodoMeta } from '@/entities/todo'
import { parseQuickInput } from './quickInput'

export const useAddTodoForm = (onAdd: (text: string, meta: TodoMeta) => void) => {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>(DEFAULT_META.priority)
  const [due, setDue] = useState<string | null>(DEFAULT_META.due)
  const [description, setDescription] = useState('')
  const [emptyError, setEmptyError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const quick = parseQuickInput(text)
  const recognized = { priority: quick.priority, due: quick.due }
  const hasRecognized = quick.priority !== null || quick.due !== null
  const length = quick.text.length
  const tooLong = length > MAX_TODO_LENGTH
  const descriptionTooLong = description.trim().length > MAX_DESCRIPTION_LENGTH
  const error = descriptionTooLong
    ? `Описание: не более ${MAX_DESCRIPTION_LENGTH} символов - сейчас ${description.trim().length}`
    : tooLong
      ? `Не более ${MAX_TODO_LENGTH} символов - сейчас ${length}. Сократите на ${length - MAX_TODO_LENGTH}.`
      : emptyError
        ? 'Введите текст задачи'
        : null

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    setEmptyError(false)
  }

  const onBlur = () => setEmptyError(false)

  const fill = (value: string) => {
    setText(value)
    setEmptyError(false)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (tooLong || descriptionTooLong) return
    const result = validateTodoText(quick.text)
    if (!result.ok) {
      setEmptyError(true)
      setShaking(true)
      return
    }
    onAdd(result.value, {
      priority: quick.priority ?? priority,
      due: quick.due ?? due,
      description: description.trim(),
    })
    setText('')
    setDue(null)
    setDescription('')
  }

  return {
    text,
    priority,
    due,
    error,
    tooLong: tooLong || descriptionTooLong,
    description,
    onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setDescription(event.target.value),
    showCount: length >= 100,
    count: length,
    recognized,
    hasRecognized,
    descriptionCount: description.trim().length,
    shaking,
    onShakeEnd: (event: React.AnimationEvent) => {
      if (event.target === event.currentTarget) setShaking(false)
    },
    setPriority,
    setDue,
    onChange,
    onBlur,
    fill,
    onSubmit,
  }
}
