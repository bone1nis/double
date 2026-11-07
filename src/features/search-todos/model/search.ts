import type { Todo } from '@/entities/todo'

export const searchTodos = (todos: readonly Todo[], query: string): Todo[] => {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [...todos]
  return todos.filter(
    (t) => t.text.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle),
  )
}
