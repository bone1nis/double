import { AnimatePresence } from 'motion/react'
import { useTodoStore } from '@/entities/todo'
import { TodoPanelContent } from '../TodoPanelContent'

export interface TodoPanelProps {
  todoId: string | null
  onClose: () => void
}

export const TodoPanel = ({ todoId, onClose }: TodoPanelProps) => {
  const todo = useTodoStore((s) => s.todos.find((t) => t.id === todoId) ?? null)

  return (
    <AnimatePresence>
      {todo && <TodoPanelContent key={todo.id} todo={todo} onClose={onClose} />}
    </AnimatePresence>
  )
}
