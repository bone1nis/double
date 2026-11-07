import { describe, expect, it } from 'vitest'
import type { Todo } from '@/entities/todo'
import { filterByPriority, filterTodos } from './filter'

const make = (id: string, completed: boolean): Todo => ({
  id,
  text: `task ${id}`,
  completed,
  createdAt: 1,
  priority: 'medium',
  due: null,
  description: '',
})

describe('filterTodos', () => {
  const list = [make('1', true), make('2', false), make('3', true)]

  it('возвращает все задачи для all', () => {
    expect(filterTodos(list, 'all')).toHaveLength(3)
  })

  it('возвращает только активные задачи', () => {
    expect(filterTodos(list, 'active').map((t) => t.id)).toEqual(['2'])
  })

  it('возвращает только выполненные задачи', () => {
    expect(filterTodos(list, 'completed').map((t) => t.id)).toEqual(['1', '3'])
  })
})

describe('filterByPriority', () => {
  const withPriority = (id: string, priority: Todo['priority']): Todo => ({
    ...make(id, false),
    priority,
  })
  const list = [withPriority('1', 'high'), withPriority('2', 'low'), withPriority('3', 'high')]

  it('возвращает все задачи для all', () => {
    expect(filterByPriority(list, 'all')).toHaveLength(3)
  })

  it('оставляет только задачи с нужным приоритетом', () => {
    expect(filterByPriority(list, 'high').map((t) => t.id)).toEqual(['1', '3'])
    expect(filterByPriority(list, 'low').map((t) => t.id)).toEqual(['2'])
  })

  it('возвращает пустой список, если таких задач нет', () => {
    expect(filterByPriority(list, 'medium')).toEqual([])
  })

  it('не меняет исходный массив', () => {
    const copy = [...list]
    filterByPriority(list, 'high')
    expect(list).toEqual(copy)
  })
})
