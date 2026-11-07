import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sanitizeTodos } from './sanitize'
import { STORAGE_KEY, useTodoStore } from './store'
import type { Todo } from './types'

const mem = vi.hoisted(() => {
  const data = new Map<string, string>()
  const storage = {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  }
  vi.stubGlobal('localStorage', storage)
  return storage
})

const todo: Todo = {
  id: 'a',
  text: 'hello',
  completed: true,
  createdAt: 5,
  priority: 'medium',
  due: null,
  description: '',
}

describe('sanitizeTodos', () => {
  it('оставляет валидные задачи', () => {
    expect(sanitizeTodos([todo])).toEqual([todo])
  })

  it('игнорирует данные неверной формы', () => {
    expect(sanitizeTodos(null)).toEqual([])
    expect(sanitizeTodos('x')).toEqual([])
    expect(sanitizeTodos({ todos: [todo] })).toEqual([])
  })

  it('достраивает приоритет и срок у старых записей', () => {
    const legacy = { id: 'o', text: 'старая', completed: false, createdAt: 1 }
    expect(sanitizeTodos([legacy])).toEqual([
      { ...legacy, priority: 'medium', due: null, description: '' },
    ])
  })

  it('исправляет неверные приоритет и срок, убирает дубликаты', () => {
    const result = sanitizeTodos([
      { ...todo, priority: 'urgent', due: '31.12.2026' },
      { ...todo, text: 'дубль' },
    ])
    expect(result).toEqual([{ ...todo, priority: 'medium', due: null, description: '' }])
  })

  it('отбрасывает повреждённые записи, сохраняя валидные', () => {
    const broken = [
      todo,
      { id: 'b', text: '', completed: false, createdAt: 1 },
      { id: 'c', text: 'x', completed: 'no', createdAt: 1 },
      null,
      42,
    ]
    expect(sanitizeTodos(broken)).toEqual([todo])
  })
})

describe('хранилище задач', () => {
  beforeEach(async () => {
    mem.data.clear()
    useTodoStore.setState({ todos: [] })
    await useTodoStore.persist.rehydrate()
  })

  it('сохраняет задачи в storage', () => {
    useTodoStore.getState().add('привет')
    const saved: { state?: { todos?: unknown } } = JSON.parse(mem.data.get(STORAGE_KEY) ?? '{}')
    expect(sanitizeTodos(saved.state?.todos).map((t) => t.text)).toEqual(['привет'])
  })

  it('восстанавливает сохранённые задачи', async () => {
    mem.setItem(STORAGE_KEY, JSON.stringify({ state: { todos: [todo] }, version: 0 }))
    await useTodoStore.persist.rehydrate()
    expect(useTodoStore.getState().todos).toEqual([todo])
  })

  it('переживает невалидный JSON', async () => {
    mem.setItem(STORAGE_KEY, '{oops')
    await useTodoStore.persist.rehydrate()
    expect(useTodoStore.getState().todos).toEqual([])
  })

  it('отбрасывает повреждённые записи при загрузке', async () => {
    const raw = { state: { todos: [todo, { id: 1 }] }, version: 0 }
    mem.setItem(STORAGE_KEY, JSON.stringify(raw))
    await useTodoStore.persist.rehydrate()
    expect(useTodoStore.getState().todos).toEqual([todo])
  })

  it('добавляет, переключает, удаляет и очищает задачи', () => {
    const { add } = useTodoStore.getState()
    add('one')
    add('two')
    const [two, one] = useTodoStore.getState().todos
    expect(two?.text).toBe('two')
    useTodoStore.getState().toggle(one?.id ?? '')
    useTodoStore.getState().clearDone()
    expect(useTodoStore.getState().todos.map((t) => t.text)).toEqual(['two'])
    useTodoStore.getState().remove(two?.id ?? '')
    expect(useTodoStore.getState().todos).toEqual([])
  })

  it('редактирует и переупорядочивает задачи', () => {
    useTodoStore.getState().add('one')
    useTodoStore.getState().add('two')
    const [two, one] = useTodoStore.getState().todos
    useTodoStore.getState().edit(one?.id ?? '', { text: 'один', description: 'первый' })
    useTodoStore.getState().reorder(one?.id ?? '', two?.id ?? '')
    expect(useTodoStore.getState().todos.map((t) => t.text)).toEqual(['один', 'two'])
  })

  it('обрезает и сохраняет описание, отбрасывает не строку', () => {
    const [kept, dropped] = sanitizeTodos([
      { ...todo, id: 'k', description: '  подробности  ' },
      { ...todo, id: 'd', description: 42 },
    ])
    expect(kept?.description).toBe('подробности')
    expect(dropped?.description).toBe('')
    expect(sanitizeTodos([{ ...todo, description: 'я'.repeat(600) }])[0]?.description).toHaveLength(
      500,
    )
  })

  it('меняет приоритет, срок и восстанавливает удалённую задачу', () => {
    useTodoStore.getState().add('one', { priority: 'low', due: null, description: '' })
    const [one] = useTodoStore.getState().todos
    useTodoStore.getState().setMeta(one?.id ?? '', { priority: 'high', due: '2026-11-07' })
    expect(useTodoStore.getState().todos[0]).toMatchObject({ priority: 'high', due: '2026-11-07' })
    const removed = [{ todo: useTodoStore.getState().todos[0] ?? todo, index: 0 }]
    useTodoStore.getState().remove(one?.id ?? '')
    useTodoStore.getState().restore(removed)
    expect(useTodoStore.getState().todos.map((t) => t.text)).toEqual(['one'])
  })
})
