import { TodoItem } from '@/entities/todo'
import type { Todo, TodoMeta } from '@/entities/todo'
import { TodoTextView } from '@/features/edit-todo'
import { DragHandle, useSortableRow } from '@/features/reorder-todos'

export interface TodoRowProps {
  todo: Todo
  query: string
  selected: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onOpen: (id: string) => void
  onMetaChange: (id: string, patch: Partial<TodoMeta>) => void
}

export const TodoRow = ({
  todo,
  query,
  selected,
  onToggle,
  onRemove,
  onOpen,
  onMetaChange,
}: TodoRowProps) => {
  const { rowProps, handleProps } = useSortableRow(todo.id)
  const open = () => onOpen(todo.id)

  return (
    <TodoItem
      todo={todo}
      selected={selected}
      onToggle={onToggle}
      onRemove={onRemove}
      onOpen={open}
      onMetaChange={onMetaChange}
      leading={<DragHandle aria-label={`Перетащить задачу: ${todo.text}`} {...handleProps} />}
      {...rowProps}
    >
      <TodoTextView
        text={todo.text}
        description={todo.description}
        done={todo.completed}
        query={query}
        onOpen={open}
      />
    </TodoItem>
  )
}
