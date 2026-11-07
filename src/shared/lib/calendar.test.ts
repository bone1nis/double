import { describe, expect, it } from 'vitest'
import { buildMonthGrid } from './calendar'
import { addDays, parseISODate, toISODate } from './date'

describe('даты', () => {
  it('форматирует локальную дату в ISO', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('разбирает ISO-дату, месяц с нуля', () => {
    expect(parseISODate('2026-11-07')).toEqual({ year: 2026, month: 10, day: 7 })
  })

  it('сдвигает дату через границы месяца и года', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('buildMonthGrid', () => {
  const grid = buildMonthGrid(2026, 10)

  it('всегда возвращает шесть недель', () => {
    expect(grid).toHaveLength(42)
  })

  it('начинается с понедельника', () => {
    expect(grid[0]).toMatchObject({ iso: '2026-10-26', inMonth: false })
  })

  it('помечает дни месяца и соседних месяцев', () => {
    expect(grid.filter((c) => c.inMonth)).toHaveLength(30)
    expect(grid.find((c) => c.iso === '2026-11-01')?.inMonth).toBe(true)
    expect(grid.at(-1)).toMatchObject({ iso: '2026-12-06', inMonth: false })
  })

  it('правильно ставит месяц, который начинается в понедельник', () => {
    expect(buildMonthGrid(2026, 5)[0]).toMatchObject({ iso: '2026-06-01', inMonth: true })
  })
})
