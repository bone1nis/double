import { toISODate } from '@/shared/lib'

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const DAY_MS = 86_400_000

export type DueState = 'overdue' | 'today' | 'soon' | 'later'

export { addDays, toISODate } from '@/shared/lib'

export const isISODate = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  toISODate(new Date(`${value}T00:00:00`)) === value

const dayNumber = (iso: string): number => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / DAY_MS
}

const daysFrom = (iso: string, today: string): number => dayNumber(iso) - dayNumber(today)

export const getDueState = (iso: string, today: string = toISODate(new Date())): DueState => {
  const diff = daysFrom(iso, today)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  return diff <= 2 ? 'soon' : 'later'
}

export const formatDue = (iso: string, today: string = toISODate(new Date())): string => {
  const diff = daysFrom(iso, today)
  if (diff === 0) return 'Сегодня'
  if (diff === 1) return 'Завтра'
  if (diff === -1) return 'Вчера'
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  const sameYear = year === Number(today.slice(0, 4))
  return `${day} ${MONTHS[month - 1]}${sameYear ? '' : ` ${year}`}`
}

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export const formatShort = (iso: string): string => {
  const [, month = 1, day = 1] = iso.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

export const formatWeekday = (iso: string): string => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  return WEEKDAYS[new Date(year, month - 1, day).getDay()] ?? ''
}
