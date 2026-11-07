import './TodoPanelContent.scss'
import { DuePicker, PrioritySelect, useTodoStore } from '@/entities/todo'
import type { Todo } from '@/entities/todo'
import { TodoDescriptionField, TodoTitleField, useTodoEditor } from '@/features/edit-todo'
import { removeTodoWithUndo } from '@/features/undo-delete'
import { TrashIcon } from '@/shared/assets'
import { Button, Drawer, Tabs } from '@/shared/ui'

export interface TodoPanelContentProps {
  todo: Todo
  onClose: () => void
}

type Status = 'active' | 'done'

const STATUS_OPTIONS = [
  { value: 'active', label: 'В работе' },
  { value: 'done', label: 'Выполнена' },
] as const

const createdFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long', timeStyle: 'short' })

export const TodoPanelContent = ({ todo, onClose }: TodoPanelContentProps) => {
  const { toggle, edit, setMeta } = useTodoStore()
  const status: Status = todo.completed ? 'done' : 'active'
  const editor = useTodoEditor({ text: todo.text, description: todo.description }, (content) =>
    edit(todo.id, content),
  )

  return (
    <Drawer
      label="Задача"
      header={<TodoTitleField {...editor.title} />}
      onClose={onClose}
      footer={
        <Button
          variant="link"
          onClick={() => {
            removeTodoWithUndo(todo.id)
            onClose()
          }}
        >
          <TrashIcon width={16} height={16} />
          Удалить задачу
        </Button>
      }
    >
      <div className="todo-panel">
        <TodoDescriptionField {...editor.description} />
        <dl className="todo-panel__props">
          <div className="todo-panel__row">
            <dt>Статус</dt>
            <dd>
              <Tabs
                label="Статус задачи"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(next) => next !== status && toggle(todo.id)}
              />
            </dd>
          </div>
          <div className="todo-panel__row">
            <dt>Приоритет</dt>
            <dd>
              <PrioritySelect
                value={todo.priority}
                onChange={(priority) => setMeta(todo.id, { priority })}
              />
            </dd>
          </div>
          <div className="todo-panel__row">
            <dt>Срок</dt>
            <dd>
              <DuePicker value={todo.due} onChange={(due) => setMeta(todo.id, { due })} />
            </dd>
          </div>
          <div className="todo-panel__row">
            <dt>Создана</dt>
            <dd className="todo-panel__created">{createdFormat.format(todo.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </Drawer>
  )
}
