import './PriorityFilter.scss'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/shared/lib'
import { Popover } from '@/shared/ui'
import { PRIORITY_FILTER_LABELS } from '../../config/constants'
import { PRIORITY_FILTERS } from '../../model/filter'
import type { PriorityFilter as PriorityFilterValue } from '../../model/filter'

export interface PriorityFilterProps {
  value: PriorityFilterValue
  onChange: (value: PriorityFilterValue) => void
}

export const PriorityFilter = ({ value, onChange }: PriorityFilterProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const active = value !== 'all'

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={cn('priority-filter', active && 'priority-filter--active')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {active && (
          <span className={cn('priority-filter__dot', `priority-filter__dot--${value}`)} />
        )}
        <span>{active ? PRIORITY_FILTER_LABELS[value] : 'Приоритет'}</span>
        <span className="priority-filter__caret" aria-hidden="true" />
      </button>
      <Popover open={open} anchorRef={anchorRef} label="Фильтр по приоритету" onClose={close}>
        <div className="priority-filter__menu" role="menu" aria-label="Приоритет">
          {PRIORITY_FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === value}
              className="priority-filter__option"
              onClick={() => {
                onChange(option)
                close()
              }}
            >
              <span
                className={cn(
                  'priority-filter__dot',
                  option === 'all'
                    ? 'priority-filter__dot--none'
                    : `priority-filter__dot--${option}`,
                )}
              />
              {PRIORITY_FILTER_LABELS[option]}
            </button>
          ))}
        </div>
      </Popover>
    </>
  )
}
