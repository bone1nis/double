import './PrioritySelect.scss'
import { cn } from '@/shared/lib'
import { PRIORITY_LABEL } from '../../config/constants'
import { PRIORITIES } from '../../model/types'
import type { Priority } from '../../model/types'

export interface PrioritySelectProps {
  value: Priority
  onChange: (value: Priority) => void
}

export const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => (
  <div className="priority-select" role="radiogroup" aria-label="Приоритет">
    {PRIORITIES.map((priority) => (
      <button
        key={priority}
        type="button"
        role="radio"
        aria-checked={priority === value}
        aria-label={`Приоритет: ${PRIORITY_LABEL[priority].toLowerCase()}`}
        title={`Приоритет: ${PRIORITY_LABEL[priority].toLowerCase()}`}
        className={cn('priority-select__option', `priority-select__option--${priority}`)}
        onClick={() => onChange(priority)}
      >
        <span className="priority-select__dot" />
        <span className="priority-select__label">{PRIORITY_LABEL[priority]}</span>
      </button>
    ))}
  </div>
)
