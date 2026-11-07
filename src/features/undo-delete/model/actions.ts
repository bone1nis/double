import { findRemoved, useTodoStore } from '@/entities/todo'
import { pluralize } from '@/shared/lib'
import { useUndoStore } from './store'

const REMOVED_FORMS = ['задача', 'задачи', 'задач'] as const

export const removeTodoWithUndo = (id: string): void => {
  const { todos, remove } = useTodoStore.getState()
  const removed = findRemoved(todos, [id])
  const [first] = removed
  if (!first) return
  useUndoStore.getState().push('Задача удалена', `«${first.todo.text}»`, removed)
  remove(id)
}

export const clearCompletedWithUndo = (): void => {
  const { todos, clearDone } = useTodoStore.getState()
  const removed = findRemoved(
    todos,
    todos.filter((t) => t.completed).map((t) => t.id),
  )
  const [first] = removed
  if (!first) return
  const { push } = useUndoStore.getState()
  if (removed.length === 1) {
    push('Задача удалена', `«${first.todo.text}»`, removed)
  } else {
    push(`Удалено ${removed.length} ${pluralize(removed.length, REMOVED_FORMS)}`, '', removed)
  }
  clearDone()
}

export const restoreRemoved = (): void => {
  const { entry, dismiss } = useUndoStore.getState()
  if (!entry) return
  useTodoStore.getState().restore(entry.removed)
  dismiss()
}
