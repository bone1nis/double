import type { Priority } from '../model/types'

export const ACTIVE_FORMS = ['активная задача', 'активные задачи', 'активных задач'] as const

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}
