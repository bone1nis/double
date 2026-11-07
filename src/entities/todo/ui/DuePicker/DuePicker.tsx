import './DuePicker.scss'
import { useCallback, useRef, useState } from 'react'
import { CalendarIcon } from '@/shared/assets'
import { cn } from '@/shared/lib'
import { Popover } from '@/shared/ui'
import { formatDue } from '../../model/date'
import { DuePopup } from '../DuePopup'

export interface DuePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  className?: string
}

export const DuePicker = ({ value, onChange, className }: DuePickerProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <div className={cn('due-picker', className)}>
      <button
        ref={anchorRef}
        type="button"
        className={cn('due-picker__button', value && 'due-picker__button--set')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Срок"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarIcon width={16} height={16} />
        <span className={cn('due-picker__text', !value && 'due-picker__text--empty')}>
          {value ? formatDue(value) : 'Срок'}
        </span>
      </button>
      <Popover open={open} anchorRef={anchorRef} label="Выбор срока" onClose={close}>
        <DuePopup
          value={value}
          onPick={(next) => {
            onChange(next)
            close()
          }}
        />
      </Popover>
    </div>
  )
}
