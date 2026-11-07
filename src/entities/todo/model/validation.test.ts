import { describe, expect, it } from 'vitest'
import { MAX_TODO_LENGTH, validateTodoText } from './validation'

describe('validateTodoText', () => {
  it('обрезает пробелы по краям', () => {
    expect(validateTodoText('  купить хлеб  ')).toEqual({ ok: true, value: 'купить хлеб' })
  })

  it.each(['', '   ', '\t\n '])('отклоняет пустой ввод %j', (input) => {
    expect(validateTodoText(input)).toMatchObject({ ok: false })
  })

  it('принимает текст максимальной длины', () => {
    expect(validateTodoText('a'.repeat(MAX_TODO_LENGTH)).ok).toBe(true)
  })

  it('отклоняет слишком длинный текст с сообщением', () => {
    const result = validateTodoText('a'.repeat(MAX_TODO_LENGTH + 1))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain(String(MAX_TODO_LENGTH))
  })

  it('считает длину после trim', () => {
    expect(validateTodoText(` ${'a'.repeat(MAX_TODO_LENGTH)} `).ok).toBe(true)
  })
})
