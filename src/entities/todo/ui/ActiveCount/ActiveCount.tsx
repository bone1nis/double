import './ActiveCount.scss'
import { pluralize } from '@/shared/lib'
import { ACTIVE_FORMS } from '../../config/constants'

export interface ActiveCountProps {
  count: number
  found?: { shown: number; total: number }
}

export const ActiveCount = ({ count, found }: ActiveCountProps) => (
  <span className="active-count" aria-live="polite">
    {found
      ? `Найдено ${found.shown} из ${found.total}`
      : `${count} ${pluralize(count, ACTIVE_FORMS)}`}
  </span>
)
