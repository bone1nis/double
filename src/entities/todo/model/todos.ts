import type { RemovedTodo, Todo, TodoContent, TodoMeta } from './types'

export const DEFAULT_META: TodoMeta = { priority: 'medium', due: null, description: '' }

export const createTodo = (
  text: string,
  meta: TodoMeta = DEFAULT_META,
  now: number = Date.now(),
): Todo => {
  return { id: crypto.randomUUID(), text, completed: false, createdAt: now, ...meta }
}

export const addTodo = (todos: readonly Todo[], todo: Todo): Todo[] => {
  return [todo, ...todos]
}

export const toggleTodo = (todos: readonly Todo[], id: string): Todo[] => {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
}

export const removeTodo = (todos: readonly Todo[], id: string): Todo[] => {
  return todos.filter((t) => t.id !== id)
}

export const clearCompleted = (todos: readonly Todo[]): Todo[] => {
  return todos.filter((t) => !t.completed)
}

export const countActive = (todos: readonly Todo[]): number => {
  return todos.reduce((n, t) => (t.completed ? n : n + 1), 0)
}

export const updateTodoContent = (
  todos: readonly Todo[],
  id: string,
  content: Partial<TodoContent>,
): Todo[] => {
  return todos.map((t) => (t.id === id ? { ...t, ...content } : t))
}

export const updateTodoMeta = (
  todos: readonly Todo[],
  id: string,
  patch: Partial<TodoMeta>,
): Todo[] => {
  return todos.map((t) => (t.id === id ? { ...t, ...patch } : t))
}

export const findRemoved = (todos: readonly Todo[], ids: readonly string[]): RemovedTodo[] => {
  return todos.flatMap((todo, index) => (ids.includes(todo.id) ? [{ todo, index }] : []))
}

export const restoreTodos = (todos: readonly Todo[], removed: readonly RemovedTodo[]): Todo[] => {
  const present = new Set(todos.map((t) => t.id))
  return [...removed]
    .sort((a, b) => a.index - b.index)
    .reduce<Todo[]>(
      (acc, { todo, index }) => {
        if (present.has(todo.id)) return acc
        acc.splice(Math.min(index, acc.length), 0, todo)
        return acc
      },
      [...todos],
    )
}

export const nextPriority = (priority: Todo['priority']): Todo['priority'] => {
  if (priority === 'low') return 'medium'
  return priority === 'medium' ? 'high' : 'low'
}

export const moveTodo = (todos: readonly Todo[], activeId: string, overId: string): Todo[] => {
  const from = todos.findIndex((t) => t.id === activeId)
  const to = todos.findIndex((t) => t.id === overId)
  const next = [...todos]
  if (from === -1 || to === -1) return next
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
