import type { Priority, Todo } from '@/entities/todo'

export type Filter = 'all' | 'active' | 'completed'

export const FILTERS: readonly Filter[] = ['all', 'active', 'completed']

export const filterTodos = (todos: readonly Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    case 'all':
      return [...todos]
  }
}

export type PriorityFilter = 'all' | Priority

export const PRIORITY_FILTERS: readonly PriorityFilter[] = ['all', 'high', 'medium', 'low']

export const filterByPriority = (todos: readonly Todo[], priority: PriorityFilter): Todo[] => {
  return priority === 'all' ? [...todos] : todos.filter((t) => t.priority === priority)
}
