import { create } from 'zustand'
import type { RemovedTodo } from '@/entities/todo'

export interface UndoEntry {
  id: number
  label: string
  name: string
  removed: RemovedTodo[]
}

interface UndoState {
  entry: UndoEntry | null
  push: (label: string, name: string, removed: RemovedTodo[]) => void
  dismiss: () => void
}

let lastId = 0

export const useUndoStore = create<UndoState>()((set) => ({
  entry: null,
  push: (label, name, removed) => {
    if (removed.length === 0) return
    lastId += 1
    set({ entry: { id: lastId, label, name, removed } })
  },
  dismiss: () => set({ entry: null }),
}))
