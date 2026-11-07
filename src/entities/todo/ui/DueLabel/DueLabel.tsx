import './DueLabel.scss'
import { useCallback, useRef, useState } from 'react'
import { CalendarIcon } from '@/shared/assets'
import { cn } from '@/shared/lib'
import { Popover } from '@/shared/ui'
import { formatDue, getDueState } from '../../model/date'
import { DuePopup } from '../DuePopup'

export interface DueLabelProps {
  value: string | null
  done: boolean
  onChange: (value: string | null) => void
}

export const DueLabel = ({ value, done, onChange }: DueLabelProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const state = value && !done ? getDueState(value) : null

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={cn(
          'due-label',
          !value && 'due-label--empty',
          open && 'due-label--open',
          state === 'overdue' && 'due-label--overdue',
          state === 'today' && 'due-label--today',
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value ? `Срок: ${formatDue(value)}` : 'Назначить срок'}
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarIcon width={16} height={16} />
        {value && (
          <span>
            {formatDue(value)}
            {state === 'overdue' && ' · просрочено'}
          </span>
        )}
      </button>
      <Popover open={open} anchorRef={anchorRef} align="end" label="Выбор срока" onClose={close}>
        <DuePopup
          value={value}
          onPick={(next) => {
            onChange(next)
            close()
          }}
        />
      </Popover>
    </>
  )
}
