const pad = (n: number) => String(n).padStart(2, '0')

export interface DateParts {
  year: number
  month: number
  day: number
}

export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const parseISODate = (iso: string): DateParts => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  return { year, month: month - 1, day }
}

export const addDays = (iso: string, days: number): string => {
  const { year, month, day } = parseISODate(iso)
  return toISODate(new Date(year, month, day + days))
}
