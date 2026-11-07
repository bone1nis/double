import './TodoItem.scss'
import type { LiHTMLAttributes, ReactNode } from 'react'
import { PencilIcon, TrashIcon } from '@/shared/assets'
import { cn, useExitAnimation } from '@/shared/lib'
import { Button, Checkbox } from '@/shared/ui'
import { nextPriority } from '../../model/todos'
import type { Todo, TodoMeta } from '../../model/types'
import { DueLabel } from '../DueLabel'
import { PriorityBadge } from '../PriorityBadge'

export interface TodoItemProps extends Omit<
  LiHTMLAttributes<HTMLLIElement>,
  'children' | 'onToggle'
> {
  todo: Todo
  selected: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onOpen: () => void
  onMetaChange: (id: string, patch: Partial<TodoMeta>) => void
  leading?: ReactNode
  children: ReactNode
}

export const TodoItem = ({
  todo,
  selected,
  onToggle,
  onRemove,
  onOpen,
  onMetaChange,
  leading,
  children,
  className,
  ...rest
}: TodoItemProps) => {
  const { isLeaving, startExit, onAnimationEnd } = useExitAnimation(() => onRemove(todo.id))

  return (
    <li
      className={cn(
        'todo',
        selected && 'todo--selected',
        todo.completed && 'todo--done',
        isLeaving && 'todo--leaving',
        className,
      )}
      {...rest}
      onAnimationEnd={onAnimationEnd}
    >
      {leading}
      <Checkbox
        label={`Отметить выполненной: ${todo.text}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo__main">
        <div className="todo__text">{children}</div>
        <div className="todo__meta">
          <DueLabel
            value={todo.due}
            done={todo.completed}
            onChange={(due) => onMetaChange(todo.id, { due })}
          />
          <PriorityBadge
            value={todo.priority}
            muted={todo.completed}
            onCycle={() => onMetaChange(todo.id, { priority: nextPriority(todo.priority) })}
          />
        </div>
      </div>
      <div className="todo__actions">
        <Button
          variant="icon"
          aria-label={`Открыть задачу: ${todo.text}`}
          title="Открыть"
          onClick={onOpen}
        >
          <PencilIcon width={16} height={16} />
        </Button>
        <Button
          variant="danger"
          aria-label={`Удалить задачу: ${todo.text}`}
          title="Удалить"
          disabled={isLeaving}
          onClick={startExit}
        >
          <TrashIcon width={16} height={16} />
        </Button>
      </div>
    </li>
  )
}
