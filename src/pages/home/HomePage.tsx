import './HomePage.scss'
import { useState } from 'react'
import { ProgressRing, useTodoStore } from '@/entities/todo'
import { ThemeToggle } from '@/features/toggle-theme'
import { UndoDeleteToast } from '@/features/undo-delete'
import { pluralize } from '@/shared/lib'
import { TodoBoard } from '@/widgets/todo-board'
import { TodoPanel } from '@/widgets/todo-panel'

const LEFT_FORMS = ['задача', 'задачи', 'задач'] as const
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const subtitle = (total: number, active: number): string => {
  if (total === 0) return 'Задач пока нет'
  if (active === 0) return 'Все задачи выполнены'
  return `Осталось ${active} ${pluralize(active, LEFT_FORMS)}`
}

export const HomePage = () => {
  const todos = useTodoStore((s) => s.todos)
  const active = todos.filter((t) => !t.completed).length
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const openId = todos.some((t) => t.id === selectedId) ? selectedId : null

  return (
    <main className="page">
      <header className="page__header">
        <div className="page__heading">
          <p className="page__date">{dateFormat.format(new Date())}</p>
          <h1 className="page__title">Мои задачи</h1>
          <p className="page__subtitle">{subtitle(todos.length, active)}</p>
        </div>
        <div className="page__side">
          <ProgressRing done={todos.length - active} total={todos.length} />
          <ThemeToggle />
        </div>
      </header>
      <TodoBoard selectedId={openId} onOpen={setSelectedId} />
      <TodoPanel todoId={openId} onClose={() => setSelectedId(null)} />
      <UndoDeleteToast />
    </main>
  )
}
