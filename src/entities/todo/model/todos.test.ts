import { describe, expect, it } from 'vitest'
import type { Todo } from './types'
import {
  addTodo,
  clearCompleted,
  countActive,
  createTodo,
  findRemoved,
  moveTodo,
  nextPriority,
  removeTodo,
  restoreTodos,
  toggleTodo,
  updateTodoMeta,
  updateTodoContent,
} from './todos'

const make = (id: string, completed = false): Todo => ({
  id,
  text: `task ${id}`,
  completed,
  createdAt: 1,
  priority: 'medium',
  due: null,
  description: '',
})

describe('операции над задачами', () => {
  it('создаёт активную задачу с уникальным id', () => {
    const a = createTodo('a', undefined, 100)
    const b = createTodo('b', undefined, 100)
    expect(a).toMatchObject({ text: 'a', completed: false, createdAt: 100 })
    expect(a.id).not.toBe(b.id)
  })

  it('добавляет задачу в начало, не мутируя исходный массив', () => {
    const list = [make('1')]
    const next = addTodo(list, make('2'))
    expect(next.map((t) => t.id)).toEqual(['2', '1'])
    expect(list).toHaveLength(1)
  })

  it('переключает только нужную задачу', () => {
    const next = toggleTodo([make('1'), make('2')], '2')
    expect(next.map((t) => t.completed)).toEqual([false, true])
    expect(toggleTodo(next, '2')[1]?.completed).toBe(false)
  })

  it('удаляет задачу по id', () => {
    expect(removeTodo([make('1'), make('2')], '1').map((t) => t.id)).toEqual(['2'])
  })

  it('очищает выполненные задачи', () => {
    const next = clearCompleted([make('1', true), make('2'), make('3', true)])
    expect(next.map((t) => t.id)).toEqual(['2'])
  })

  it('считает активные задачи', () => {
    expect(countActive([make('1', true), make('2'), make('3')])).toBe(2)
    expect(countActive([])).toBe(0)
  })

  it('меняет текст и описание только нужной задачи', () => {
    const next = updateTodoContent([make('1'), make('2')], '2', {
      text: 'новый',
      description: 'подробности',
    })
    expect(next.map((t) => t.text)).toEqual(['task 1', 'новый'])
    expect(next.map((t) => t.description)).toEqual(['', 'подробности'])
  })

  it('переносит задачу на место другой', () => {
    const list = [make('1'), make('2'), make('3')]
    expect(moveTodo(list, '1', '3').map((t) => t.id)).toEqual(['2', '3', '1'])
    expect(moveTodo(list, '3', '1').map((t) => t.id)).toEqual(['3', '1', '2'])
  })

  it('сохраняет порядок скрытых задач при переносе среди видимых', () => {
    const list = [make('1'), make('2'), make('3')]
    const moved = moveTodo(list, '1', '3')
    expect(moved.map((t) => t.id)).toEqual(['2', '3', '1'])
    expect(moved.filter((t) => t.id !== '2').map((t) => t.id)).toEqual(['3', '1'])
  })

  it('не меняет порядок, если id не найден', () => {
    const list = [make('1'), make('2')]
    expect(moveTodo(list, '1', 'x').map((t) => t.id)).toEqual(['1', '2'])
  })
})

describe('приоритет, срок и восстановление', () => {
  it('создаёт задачу с приоритетом и сроком', () => {
    const todo = createTodo('a', { priority: 'high', due: '2026-11-07', description: 'детали' }, 1)
    expect(todo).toMatchObject({ priority: 'high', due: '2026-11-07', description: 'детали' })
    expect(createTodo('b')).toMatchObject({ priority: 'medium', due: null, description: '' })
  })

  it('меняет приоритет и срок только у нужной задачи', () => {
    const next = updateTodoMeta([make('1'), make('2')], '2', { priority: 'low', due: '2026-12-01' })
    expect(next[0]).toMatchObject({ priority: 'medium', due: null })
    expect(next[1]).toMatchObject({ priority: 'low', due: '2026-12-01' })
  })

  it('переключает приоритет по кругу', () => {
    expect(nextPriority('low')).toBe('medium')
    expect(nextPriority('medium')).toBe('high')
    expect(nextPriority('high')).toBe('low')
  })

  it('возвращает удалённые задачи на прежние места', () => {
    const list = [make('1'), make('2'), make('3'), make('4')]
    const removed = findRemoved(list, ['2', '4'])
    const rest = list.filter((t) => t.id !== '2' && t.id !== '4')
    expect(restoreTodos(rest, removed).map((t) => t.id)).toEqual(['1', '2', '3', '4'])
  })

  it('не дублирует задачу при повторном восстановлении', () => {
    const list = [make('1'), make('2')]
    const removed = findRemoved(list, ['2'])
    expect(restoreTodos(list, removed)).toHaveLength(2)
  })

  it('ставит в конец, если прежнего индекса больше нет', () => {
    const removed = [{ todo: make('9'), index: 50 }]
    expect(restoreTodos([make('1')], removed).map((t) => t.id)).toEqual(['1', '9'])
  })
})
