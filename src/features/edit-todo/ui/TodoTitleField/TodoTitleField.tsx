import './TodoTitleField.scss'
import { Textarea } from '@/shared/ui'
import type { TextareaProps } from '@/shared/ui'

export type TodoTitleFieldProps = Omit<TextareaProps, 'label' | 'className' | 'rows'>

export const TodoTitleField = (props: TodoTitleFieldProps) => (
  <Textarea
    label="Название задачи"
    className="todo-title-field"
    placeholder="Название задачи"
    rows={1}
    {...props}
  />
)
