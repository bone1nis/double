import { boolean, number, object, string } from 'yup'
import { isISODate } from './date'
import { PRIORITIES } from './types'
import type { Priority, Todo } from './types'
import { MAX_DESCRIPTION_LENGTH, MAX_TODO_LENGTH } from './validation'

const baseSchema = object({
  id: string().required(),
  text: string().required(),
  completed: boolean().required(),
  createdAt: number().required(),
}).strict()

const isPriority = (value: unknown): value is Priority => PRIORITIES.some((p) => p === value)

const pick = (source: object, key: string): unknown => Reflect.get(source, key)

const toTodo = (value: unknown): Todo | null => {
  if (!baseSchema.isValidSync(value)) return null
  const { id, text, completed, createdAt } = value
  const priority = pick(value, 'priority')
  const due = pick(value, 'due')
  const description = pick(value, 'description')
  return {
    id,
    text: text.slice(0, MAX_TODO_LENGTH),
    completed,
    createdAt,
    priority: isPriority(priority) ? priority : 'medium',
    due: isISODate(due) ? due : null,
    description:
      typeof description === 'string' ? description.trim().slice(0, MAX_DESCRIPTION_LENGTH) : '',
  }
}

export const sanitizeTodos = (list: unknown): Todo[] => {
  if (!Array.isArray(list)) return []
  const seen = new Set<string>()
  return list.flatMap((item: unknown) => {
    const todo = toTodo(item)
    if (!todo || seen.has(todo.id)) return []
    seen.add(todo.id)
    return [todo]
  })
}
