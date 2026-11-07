import { describe, expect, it } from 'vitest'
import {
  addDays,
  formatDue,
  formatShort,
  formatWeekday,
  getDueState,
  isISODate,
  toISODate,
} from './date'

const TODAY = '2026-11-07'

describe('даты задач', () => {
  it('форматирует локальную дату в ISO', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('проверяет формат и существование даты', () => {
    expect(isISODate('2026-11-07')).toBe(true)
    expect(isISODate('2026-02-30')).toBe(false)
    expect(isISODate('07.11.2026')).toBe(false)
    expect(isISODate(20261107)).toBe(false)
  })

  it('определяет срочность срока', () => {
    expect(getDueState('2026-11-06', TODAY)).toBe('overdue')
    expect(getDueState('2026-11-07', TODAY)).toBe('today')
    expect(getDueState('2026-11-09', TODAY)).toBe('soon')
    expect(getDueState('2026-11-10', TODAY)).toBe('later')
  })

  it('считает дни корректно через границу месяца и года', () => {
    expect(getDueState('2027-01-01', '2026-12-31')).toBe('soon')
    expect(formatDue('2026-12-01', '2026-11-30')).toBe('Завтра')
  })

  it('форматирует срок для людей', () => {
    expect(formatDue('2026-11-07', TODAY)).toBe('Сегодня')
    expect(formatDue('2026-11-08', TODAY)).toBe('Завтра')
    expect(formatDue('2026-11-06', TODAY)).toBe('Вчера')
    expect(formatDue('2026-12-03', TODAY)).toBe('3 дек')
    expect(formatDue('2027-01-03', TODAY)).toBe('3 янв 2027')
  })

  it('сдвигает дату на дни через границы месяца и года', () => {
    expect(addDays('2026-11-07', 7)).toBe('2026-11-14')
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('форматирует короткую дату и день недели', () => {
    expect(formatShort('2026-11-07')).toBe('7 ноя')
    expect(formatWeekday('2026-11-07')).toBe('Сб')
  })
})
