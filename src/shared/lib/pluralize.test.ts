import { describe, expect, it } from 'vitest'
import { pluralize } from './pluralize'

const forms = ['задача', 'задачи', 'задач'] as const

describe('pluralize', () => {
  it.each([
    [1, 'задача'],
    [2, 'задачи'],
    [4, 'задачи'],
    [5, 'задач'],
    [11, 'задач'],
    [14, 'задач'],
    [21, 'задача'],
    [22, 'задачи'],
    [100, 'задач'],
  ])('для %i возвращает %s', (count, expected) => {
    expect(pluralize(count, forms)).toBe(expected)
  })
})
