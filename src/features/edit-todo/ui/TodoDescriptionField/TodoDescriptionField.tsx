import './TodoDescriptionField.scss'
import { Textarea } from '@/shared/ui'
import type { TextareaProps } from '@/shared/ui'

export type TodoDescriptionFieldProps = Omit<TextareaProps, 'label' | 'className'>

export const TodoDescriptionField = (props: TodoDescriptionFieldProps) => (
  <Textarea
    label="Описание задачи"
    className="todo-description-field"
    placeholder="Добавить описание..."
    {...props}
  />
)
