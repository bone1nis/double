import type { Todo, TodoMeta } from '@/entities/todo'
import { SortableList } from '@/features/reorder-todos'
import { TodoRow } from '../TodoRow'

export interface TodoBoardListProps {
  todos: Todo[]
  query: string
  selectedId: string | null
  onReorder: (activeId: string, overId: string) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onOpen: (id: string) => void
  onMetaChange: (id: string, patch: Partial<TodoMeta>) => void
}

export const TodoBoardList = ({
  todos,
  selectedId,
  onReorder,
  ...handlers
}: TodoBoardListProps) => (
  <SortableList ids={todos.map((t) => t.id)} onReorder={onReorder}>
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoRow key={todo.id} todo={todo} selected={todo.id === selectedId} {...handlers} />
      ))}
    </ul>
  </SortableList>
)
