import { describe, expect, it } from 'vitest'
import type { Todo } from '@/entities/todo'
import { searchTodos } from './search'

const make = (id: string, text: string, description = ''): Todo => ({
  id,
  text,
  completed: false,
  createdAt: 1,
  priority: 'medium',
  due: null,
  description,
})

describe('searchTodos', () => {
  const list = [
    make('1', 'Купить молоко'),
    make('2', 'Позвонить маме'),
    make('3', 'Молоко для кота'),
  ]

  it('возвращает все задачи для пустого запроса', () => {
    expect(searchTodos(list, '')).toHaveLength(3)
    expect(searchTodos(list, '   ')).toHaveLength(3)
  })

  it('ищет подстроку без учёта регистра', () => {
    expect(searchTodos(list, 'МОЛОКО').map((t) => t.id)).toEqual(['1', '3'])
  })

  it('игнорирует пробелы по краям запроса', () => {
    expect(searchTodos(list, '  маме ').map((t) => t.id)).toEqual(['2'])
  })

  it('ищет и по описанию', () => {
    const withDescription = [make('1', 'Отчёт', 'для бухгалтерии'), make('2', 'Звонок')]
    expect(searchTodos(withDescription, 'БУХГАЛТ').map((t) => t.id)).toEqual(['1'])
  })

  it('возвращает пустой список, если ничего не найдено', () => {
    expect(searchTodos(list, 'zzz')).toEqual([])
  })
})
