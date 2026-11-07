import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { sanitizeTodos } from './sanitize'
import {
  addTodo,
  clearCompleted,
  createTodo,
  moveTodo,
  removeTodo,
  restoreTodos,
  toggleTodo,
  updateTodoMeta,
  updateTodoContent,
} from './todos'
import type { RemovedTodo, Todo, TodoContent, TodoMeta } from './types'

export const STORAGE_KEY = 'doable.todos.v1'

interface TodoState {
  todos: Todo[]
  add: (text: string, meta?: TodoMeta) => void
  toggle: (id: string) => void
  remove: (id: string) => void
  edit: (id: string, content: Partial<TodoContent>) => void
  setMeta: (id: string, patch: Partial<TodoMeta>) => void
  reorder: (activeId: string, overId: string) => void
  clearDone: () => void
  restore: (removed: readonly RemovedTodo[]) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      add: (text, meta) => set((s) => ({ todos: addTodo(s.todos, createTodo(text, meta)) })),
      toggle: (id) => set((s) => ({ todos: toggleTodo(s.todos, id) })),
      remove: (id) => set((s) => ({ todos: removeTodo(s.todos, id) })),
      edit: (id, content) => set((s) => ({ todos: updateTodoContent(s.todos, id, content) })),
      setMeta: (id, patch) => set((s) => ({ todos: updateTodoMeta(s.todos, id, patch) })),
      reorder: (activeId, overId) => set((s) => ({ todos: moveTodo(s.todos, activeId, overId) })),
      clearDone: () => set((s) => ({ todos: clearCompleted(s.todos) })),
      restore: (removed) => set((s) => ({ todos: restoreTodos(s.todos, removed) })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ todos: s.todos }),
      merge: (persisted, current) => ({
        ...current,
        todos: sanitizeTodos(
          typeof persisted === 'object' && persisted !== null && 'todos' in persisted
            ? persisted.todos
            : undefined,
        ),
      }),
    },
  ),
)
