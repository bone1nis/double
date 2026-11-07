import { describe, expect, it } from 'vitest'
import { getDraftErrors, resolveDraft } from './draft'

const current = { text: 'Купить хлеб', description: '' }

describe('resolveDraft', () => {
  it('возвращает пустой патч, если ничего не изменилось', () => {
    expect(resolveDraft(current, current)).toEqual({ ok: true, value: current, patch: {} })
  })

  it('обрезает пробелы и видит изменение текста', () => {
    expect(resolveDraft(current, { text: '  Купить молоко ', description: '' })).toEqual({
      ok: true,
      value: { text: 'Купить молоко', description: '' },
      patch: { text: 'Купить молоко' },
    })
  })

  it('видит изменение одного только описания', () => {
    const result = resolveDraft(current, { text: current.text, description: 'в магазине у дома' })
    expect(result).toMatchObject({ ok: true, patch: { description: 'в магазине у дома' } })
    expect(result.ok && 'text' in result.patch).toBe(false)
  })

  it('отклоняет пустой текст', () => {
    const result = resolveDraft(current, { text: '   ', description: '' })
    expect(result).toMatchObject({ ok: false, descriptionError: null })
    expect(result.ok ? null : result.textError).toBeTruthy()
  })

  it('отклоняет слишком длинное описание, не трогая текст', () => {
    const result = resolveDraft(current, { text: current.text, description: 'я'.repeat(501) })
    expect(result).toMatchObject({ ok: false, textError: null })
    expect(result.ok ? null : result.descriptionError).toContain('500')
  })
})

describe('getDraftErrors', () => {
  it('не находит ошибок в корректном черновике', () => {
    expect(getDraftErrors({ text: 'Купить хлеб', description: '' })).toEqual({
      textError: null,
      descriptionError: null,
    })
  })

  it('сразу видит пустое название', () => {
    expect(getDraftErrors({ text: '', description: '' }).textError).toBeTruthy()
    expect(getDraftErrors({ text: '   ', description: '' }).textError).toBeTruthy()
  })

  it('видит слишком длинное название и пишет текущую длину', () => {
    const { textError } = getDraftErrors({ text: 'я'.repeat(121), description: '' })
    expect(textError).toContain('120')
    expect(textError).toContain('121')
  })

  it('видит слишком длинное описание, не затрагивая название', () => {
    const result = getDraftErrors({ text: 'Купить хлеб', description: 'я'.repeat(501) })
    expect(result.textError).toBeNull()
    expect(result.descriptionError).toContain('500')
  })

  it('не считает ошибкой пустое описание и пробелы в нём', () => {
    expect(getDraftErrors({ text: 'Купить хлеб', description: '   ' }).descriptionError).toBeNull()
  })
})
