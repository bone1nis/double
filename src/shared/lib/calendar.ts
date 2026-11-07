import { toISODate } from './date'

export interface CalendarCell {
  iso: string
  day: number
  inMonth: boolean
}

const WEEKS = 6

export const buildMonthGrid = (year: number, month: number): CalendarCell[] => {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  return Array.from({ length: WEEKS * 7 }, (_, index) => {
    const date = new Date(year, month, index - offset + 1)
    return { iso: toISODate(date), day: date.getDate(), inMonth: date.getMonth() === month }
  })
}
