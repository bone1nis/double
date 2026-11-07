import { FILTERS } from '../model/filter'
import type { Filter, PriorityFilter } from '../model/filter'

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'Все',
  active: 'Активные',
  completed: 'Выполненные',
}

export const FILTER_OPTIONS = FILTERS.map((value) => ({ value, label: FILTER_LABELS[value] }))

export const PRIORITY_FILTER_LABELS: Record<PriorityFilter, string> = {
  all: 'Любой',
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}
