import './PriorityBadge.scss'
import { cn } from '@/shared/lib'
import { PRIORITY_LABEL } from '../../config/constants'
import type { Priority } from '../../model/types'

export interface PriorityBadgeProps {
  value: Priority
  muted?: boolean
  onCycle: () => void
}

export const PriorityBadge = ({ value, muted = false, onCycle }: PriorityBadgeProps) => (
  <button
    type="button"
    className={cn('priority-badge', `priority-badge--${value}`, muted && 'priority-badge--muted')}
    title="Сменить приоритет"
    aria-label={`Приоритет: ${PRIORITY_LABEL[value].toLowerCase()}. Нажмите, чтобы сменить`}
    onClick={onCycle}
  >
    <span className="priority-badge__dot" />
    {PRIORITY_LABEL[value]}
  </button>
)
