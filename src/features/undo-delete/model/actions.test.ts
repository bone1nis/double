import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTodoStore } from '@/entities/todo'
import type { Todo } from '@/entities/todo'
import { clearCompletedWithUndo, removeTodoWithUndo, restoreRemoved } from './actions'
import { useUndoStore } from './store'

vi.hoisted(() => {
  const data = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  })
})

const make = (id: string, completed = false): Todo => ({
  id,
  text: `задача ${id}`,
  completed,
  createdAt: 1,
  priority: 'medium',
  due: null,
  description: '',
})

const ids = () => useTodoStore.getState().todos.map((t) => t.id)

describe('удаление с отменой', () => {
  beforeEach(() => {
    useUndoStore.setState({ entry: null })
  })

  it('удаляет задачу и кладёт её в отмену', () => {
    useTodoStore.setState({ todos: [make('1'), make('2'), make('3')] })
    removeTodoWithUndo('2')
    expect(ids()).toEqual(['1', '3'])
    expect(useUndoStore.getState().entry).toMatchObject({
      label: 'Задача удалена',
      name: '«задача 2»',
    })
  })

  it('возвращает удалённую задачу на прежнее место', () => {
    useTodoStore.setState({ todos: [make('1'), make('2'), make('3')] })
    removeTodoWithUndo('2')
    restoreRemoved()
    expect(ids()).toEqual(['1', '2', '3'])
    expect(useUndoStore.getState().entry).toBeNull()
  })

  it('ничего не делает для неизвестной задачи', () => {
    useTodoStore.setState({ todos: [make('1')] })
    removeTodoWithUndo('нет')
    expect(ids()).toEqual(['1'])
    expect(useUndoStore.getState().entry).toBeNull()
  })

  it('очищает выполненные и возвращает их обратно', () => {
    useTodoStore.setState({ todos: [make('1', true), make('2'), make('3', true)] })
    clearCompletedWithUndo()
    expect(ids()).toEqual(['2'])
    expect(useUndoStore.getState().entry?.label).toBe('Удалено 2 задачи')
    restoreRemoved()
    expect(ids()).toEqual(['1', '2', '3'])
  })

  it('для одной выполненной пишет название задачи', () => {
    useTodoStore.setState({ todos: [make('1', true), make('2')] })
    clearCompletedWithUndo()
    expect(useUndoStore.getState().entry).toMatchObject({
      label: 'Задача удалена',
      name: '«задача 1»',
    })
  })

  it('не создаёт отмену, если выполненных нет', () => {
    useTodoStore.setState({ todos: [make('1')] })
    clearCompletedWithUndo()
    expect(useUndoStore.getState().entry).toBeNull()
  })
})
