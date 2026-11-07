import './DuePopup.scss'
import { Button, Calendar } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { addDays, toISODate } from '../../model/date'

export interface DuePopupProps {
  value: string | null
  onPick: (value: string | null) => void
}

const QUICK_OPTIONS = [
  { label: 'Сегодня', days: 0 },
  { label: 'Завтра', days: 1 },
  { label: 'Через неделю', days: 7 },
] as const

export const DuePopup = ({ value, onPick }: DuePopupProps) => {
  const today = toISODate(new Date())

  return (
    <div className="due-popup">
      <div className="due-popup__quick">
        {QUICK_OPTIONS.map(({ label, days }) => {
          const date = addDays(today, days)
          return (
            <button
              key={label}
              type="button"
              className={cn('due-popup__chip', value === date && 'due-popup__chip--on')}
              onClick={() => onPick(date)}
            >
              {label}
            </button>
          )
        })}
      </div>
      <Calendar value={value} onChange={onPick} />
      {value && (
        <div className="due-popup__footer">
          <Button variant="link" onClick={() => onPick(null)}>
            Убрать срок
          </Button>
        </div>
      )}
    </div>
  )
}
