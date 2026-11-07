import { Tabs } from '@/shared/ui'
import { FILTER_OPTIONS } from '../../config/constants'
import type { Filter } from '../../model/filter'

export interface TodoFilterProps {
  value: Filter
  counts: Record<Filter, number>
  onChange: (value: Filter) => void
}

export const TodoFilter = ({ value, counts, onChange }: TodoFilterProps) => (
  <Tabs
    label="Фильтр задач"
    options={FILTER_OPTIONS.map((option) => ({ ...option, count: counts[option.value] }))}
    value={value}
    onChange={onChange}
  />
)
