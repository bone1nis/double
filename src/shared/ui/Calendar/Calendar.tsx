import './Calendar.scss'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/assets'
import { addDays, buildMonthGrid, cn, parseISODate, toISODate } from '@/shared/lib'
import { Button } from '../Button'

export interface CalendarProps {
  value: string | null
  onChange: (iso: string) => void
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const ARROW_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

const monthFormat = new Intl.DateTimeFormat('ru-RU', { month: 'long' })
const labelFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const Calendar = ({ value, onChange }: CalendarProps) => {
  const today = toISODate(new Date())
  const start = parseISODate(value ?? today)
  const [view, setView] = useState({ year: start.year, month: start.month })
  const [focusIso, setFocusIso] = useState(value ?? today)
  const gridRef = useRef<HTMLDivElement>(null)
  const shouldFocus = useRef(false)

  const cells = buildMonthGrid(view.year, view.month)
  const tabbable = cells.some((c) => c.inMonth && c.iso === focusIso)
    ? focusIso
    : cells.find((c) => c.inMonth)?.iso

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)?.focus()
  }, [focusIso, view])

  const shiftMonth = (delta: number) =>
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = ARROW_STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    const next = addDays(focusIso, step)
    const { year, month } = parseISODate(next)
    shouldFocus.current = true
    setFocusIso(next)
    setView({ year, month })
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <span className="calendar__title" aria-live="polite">
          {monthFormat.format(new Date(view.year, view.month, 1))} {view.year}
        </span>
        <div className="calendar__nav">
          <Button variant="icon" aria-label="Предыдущий месяц" onClick={() => shiftMonth(-1)}>
            <ChevronLeftIcon width={18} height={18} />
          </Button>
          <Button variant="icon" aria-label="Следующий месяц" onClick={() => shiftMonth(1)}>
            <ChevronRightIcon width={18} height={18} />
          </Button>
        </div>
      </div>
      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="calendar__grid" ref={gridRef} onKeyDown={onKeyDown}>
        {cells.map((cell) => {
          const { year, month, day } = parseISODate(cell.iso)
          return (
            <button
              key={cell.iso}
              type="button"
              data-iso={cell.iso}
              tabIndex={cell.iso === tabbable ? 0 : -1}
              aria-pressed={cell.iso === value}
              aria-label={labelFormat.format(new Date(year, month, day))}
              className={cn(
                'calendar__day',
                !cell.inMonth && 'calendar__day--outside',
                cell.iso === today && 'calendar__day--today',
                cell.iso === value && 'calendar__day--selected',
              )}
              onClick={() => onChange(cell.iso)}
              onFocus={() => setFocusIso(cell.iso)}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
