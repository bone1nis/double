import { CircleCheckIcon, CircleIcon, ListChecksIcon, SearchXIcon } from '@/shared/assets'

export type EmptyKind = 'all' | 'search' | 'priority' | 'active' | 'completed'

export interface EmptyConfig {
  Icon: typeof ListChecksIcon
  title: string
  action: string
}

export const EMPTY_STATES: Record<EmptyKind, EmptyConfig> = {
  all: { Icon: ListChecksIcon, title: 'Список пуст', action: 'Новая задача' },
  search: { Icon: SearchXIcon, title: 'Ничего не найдено', action: 'Сбросить поиск' },
  priority: { Icon: SearchXIcon, title: 'Ничего не найдено', action: 'Сбросить фильтр' },
  active: { Icon: CircleCheckIcon, title: 'Всё выполнено', action: 'Показать все' },
  completed: { Icon: CircleIcon, title: 'Пока ничего не выполнено', action: 'Показать все' },
}

export const emptyText = (kind: EmptyKind, query: string): string => {
  switch (kind) {
    case 'all':
      return 'Добавьте первую задачу в поле выше или нажмите N, чтобы сразу перейти к вводу.'
    case 'search':
      return `По запросу «${query.trim()}» задач нет. Проверьте написание или сбросьте поиск.`
    case 'priority':
      return 'Задач с таким приоритетом нет. Выберите другой или сбросьте фильтр.'
    case 'active':
      return 'Активных задач не осталось.'
    case 'completed':
      return 'Отмеченные задачи появятся здесь.'
  }
}

export const HINTS = [
  { keys: 'N', text: 'новая задача' },
  { keys: '/', text: 'поиск' },
  { keys: 'Esc', text: 'закрыть панель' },
] as const
