import type { Priority } from '@/entities/todo'
import { addDays, parseISODate, toISODate } from '@/shared/lib'

export interface QuickInput {
  text: string
  priority: Priority | null
  due: string | null
}

const START = '(?<=^|\\s)'
const END = '(?=$|\\s|[.,;:!?])'
const flags = 'iu'

const PRIORITY_PATTERN = new RegExp(
  `${START}!(высок\\p{L}*|средн\\p{L}*|низк\\p{L}*|high|medium|low)${END}`,
  flags,
)
const RELATIVE_WORDS = new RegExp(`${START}(сегодня|завтра|послезавтра)${END}`, flags)
const NEXT_WEEK = new RegExp(`${START}через\\s+неделю${END}`, flags)
const IN_N_UNITS = new RegExp(
  `${START}через\\s+(\\d{1,3})\\s+(день|дн\\p{L}*|недел\\p{L}*)${END}`,
  flags,
)
const DAY_MONTH = new RegExp(`${START}(\\d{1,2})\\.(\\d{2})(?:\\.(\\d{4}))?${END}`, flags)

const RELATIVE_OFFSETS: Record<string, number> = { сегодня: 0, завтра: 1, послезавтра: 2 }

const toPriority = (word: string): Priority | null => {
  const value = word.toLowerCase()
  if (value.startsWith('высок') || value === 'high') return 'high'
  if (value.startsWith('средн') || value === 'medium') return 'medium'
  if (value.startsWith('низк') || value === 'low') return 'low'
  return null
}

const resolveDayMonth = (
  today: string,
  day: number,
  month: number,
  year?: number,
): string | null => {
  const valid = (target: number): string | null => {
    const date = new Date(target, month - 1, day)
    const same =
      date.getFullYear() === target && date.getMonth() === month - 1 && date.getDate() === day
    return same ? toISODate(date) : null
  }
  if (year !== undefined) return valid(year)
  const { year: currentYear } = parseISODate(today)
  for (let target = currentYear; target <= currentYear + 8; target += 1) {
    const iso = valid(target)
    if (iso && iso >= today) return iso
  }
  return null
}

interface Found {
  start: number
  end: number
  due: string
}

const findDue = (raw: string, today: string): Found | null => {
  const span = (match: RegExpExecArray) => ({
    start: match.index,
    end: match.index + match[0].length,
  })

  const inUnits = IN_N_UNITS.exec(raw)
  if (inUnits) {
    const count = Number(inUnits[1])
    const days = (inUnits[2] ?? '').toLowerCase().startsWith('нед') ? count * 7 : count
    return { ...span(inUnits), due: addDays(today, days) }
  }

  const nextWeek = NEXT_WEEK.exec(raw)
  if (nextWeek) return { ...span(nextWeek), due: addDays(today, 7) }

  const word = RELATIVE_WORDS.exec(raw)
  if (word) {
    return {
      ...span(word),
      due: addDays(today, RELATIVE_OFFSETS[(word[1] ?? '').toLowerCase()] ?? 0),
    }
  }

  const dayMonth = DAY_MONTH.exec(raw)
  if (dayMonth) {
    const year = dayMonth[3] === undefined ? undefined : Number(dayMonth[3])
    const due = resolveDayMonth(today, Number(dayMonth[1]), Number(dayMonth[2]), year)
    if (due) return { ...span(dayMonth), due }
  }

  return null
}

const cut = (text: string, start: number, end: number): string =>
  `${text.slice(0, start)} ${text.slice(end)}`

export const parseQuickInput = (raw: string, today: string = toISODate(new Date())): QuickInput => {
  let text = raw
  let priority: Priority | null = null
  let due: string | null = null

  const priorityMatch = PRIORITY_PATTERN.exec(text)
  const parsedPriority = priorityMatch ? toPriority(priorityMatch[1] ?? '') : null
  if (priorityMatch && parsedPriority) {
    priority = parsedPriority
    text = cut(text, priorityMatch.index, priorityMatch.index + priorityMatch[0].length)
  }

  const found = findDue(text, today)
  if (found) {
    due = found.due
    text = cut(text, found.start, found.end)
  }

  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned === '' || (priority === null && due === null)) {
    return { text: raw, priority: null, due: null }
  }
  return { text: cleaned, priority, due }
}
