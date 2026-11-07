export const PRIORITIES = ['low', 'medium', 'high'] as const

export type Priority = (typeof PRIORITIES)[number]

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  priority: Priority
  due: string | null
  description: string
}

export interface TodoMeta {
  priority: Priority
  due: string | null
  description: string
}

export interface TodoContent {
  text: string
  description: string
}

export interface RemovedTodo {
  todo: Todo
  index: number
}
