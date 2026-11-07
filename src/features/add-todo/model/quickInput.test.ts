import { describe, expect, it } from 'vitest'
import { parseQuickInput } from './quickInput'

const TODAY = '2026-11-07'
const parse = (text: string) => parseQuickInput(text, TODAY)

describe('быстрый ввод', () => {
  it('понимает срок и приоритет в одной строке', () => {
    expect(parse('Купить молоко завтра !высокий')).toEqual({
      text: 'Купить молоко',
      priority: 'high',
      due: '2026-11-08',
    })
  })

  it('понимает слова сегодня, завтра и послезавтра', () => {
    expect(parse('сдать отчёт сегодня').due).toBe('2026-11-07')
    expect(parse('сдать отчёт завтра').due).toBe('2026-11-08')
    expect(parse('сдать отчёт послезавтра')).toMatchObject({
      text: 'сдать отчёт',
      due: '2026-11-09',
    })
  })

  it('понимает «через неделю» и «через N дней»', () => {
    expect(parse('созвон через неделю').due).toBe('2026-11-14')
    expect(parse('позвонить маме через 3 дня')).toMatchObject({
      text: 'позвонить маме',
      due: '2026-11-10',
    })
    expect(parse('счёт через 1 день').due).toBe('2026-11-08')
    expect(parse('отпуск через 2 недели').due).toBe('2026-11-21')
  })

  it('понимает дату в формате ДД.ММ и ДД.ММ.ГГГГ', () => {
    expect(parse('встреча 12.11')).toMatchObject({ text: 'встреча', due: '2026-11-12' })
    expect(parse('встреча 5.12.2027').due).toBe('2027-12-05')
  })

  it('переносит прошедшую дату без года на следующий год', () => {
    expect(parse('налог 05.11').due).toBe('2027-11-05')
    expect(parse('налог 07.11').due).toBe('2026-11-07')
  })

  it('не принимает число с одной цифрой в месяце за дату', () => {
    expect(parse('обновить до 2.5')).toEqual({ text: 'обновить до 2.5', priority: null, due: null })
  })

  it('для 29 февраля без года ищет ближайший високосный год', () => {
    expect(parse('день рождения 29.02').due).toBe('2028-02-29')
    expect(parseQuickInput('день рождения 29.02', '2028-03-01').due).toBe('2032-02-29')
  })

  it('игнорирует несуществующие даты', () => {
    expect(parse('встреча 31.02')).toEqual({ text: 'встреча 31.02', priority: null, due: null })
  })

  it('понимает приоритет словами на русском и английском', () => {
    expect(parse('задача !низкий').priority).toBe('low')
    expect(parse('задача !средний').priority).toBe('medium')
    expect(parse('задача !high').priority).toBe('high')
  })

  it('не учитывает регистр', () => {
    expect(parse('Задача ЗАВТРА !ВЫСОКИЙ')).toMatchObject({
      text: 'Задача',
      priority: 'high',
      due: '2026-11-08',
    })
  })

  it('убирает слово из середины фразы и лишние пробелы', () => {
    expect(parse('позвонить  завтра   маме')).toMatchObject({ text: 'позвонить маме' })
  })

  it('не трогает обычный текст', () => {
    expect(parse('Купить хлеб')).toEqual({ text: 'Купить хлеб', priority: null, due: null })
    expect(parse('забыть заватра')).toMatchObject({ priority: null, due: null })
  })

  it('не считает приоритетом незнакомое слово после восклицательного знака', () => {
    expect(parse('срочно !!! позвонить')).toMatchObject({ priority: null, due: null })
    expect(parse('задача !срочно')).toMatchObject({ priority: null })
  })

  it('оставляет текст как есть, если после разбора он пустой', () => {
    expect(parse('завтра')).toEqual({ text: 'завтра', priority: null, due: null })
    expect(parse('!высокий завтра')).toEqual({ text: '!высокий завтра', priority: null, due: null })
  })

  it('не путает слово внутри другого слова', () => {
    expect(parse('послезавтрашний план')).toMatchObject({ due: null })
  })
})
