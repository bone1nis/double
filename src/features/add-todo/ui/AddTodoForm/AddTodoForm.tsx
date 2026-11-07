import './AddTodoForm.scss'
import { useRef } from 'react'
import type { Ref } from 'react'
import {
  DuePicker,
  MAX_DESCRIPTION_LENGTH,
  MAX_TODO_LENGTH,
  PRIORITY_LABEL,
  PrioritySelect,
  formatDue,
} from '@/entities/todo'
import type { TodoMeta } from '@/entities/todo'
import { AlertIcon, PlusIcon } from '@/shared/assets'
import { cn } from '@/shared/lib'
import { Button, Kbd } from '@/shared/ui'
import { useAddTodoForm } from '../../model/useAddTodoForm'
import { QuickInputHelp } from '../QuickInputHelp'

export interface AddTodoFormProps {
  onAdd: (text: string, meta: TodoMeta) => void
  inputRef?: Ref<HTMLInputElement>
}

export const AddTodoForm = ({ onAdd, inputRef }: AddTodoFormProps) => {
  const form = useAddTodoForm(onAdd)
  const rootRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="add-form" ref={rootRef}>
      <form
        className={cn(
          'add-form__card',
          form.error && 'add-form__card--invalid',
          form.shaking && 'add-form__card--shake',
        )}
        onSubmit={form.onSubmit}
        onAnimationEnd={form.onShakeEnd}
        noValidate
      >
        <div className="add-form__top">
          <PlusIcon width={18} height={18} className="add-form__plus" />
          <input
            ref={inputRef}
            className="add-form__input"
            value={form.text}
            placeholder="Что нужно сделать? Например: позвонить маме завтра !высокий"
            aria-label="Новая задача"
            aria-invalid={form.error !== null}
            aria-describedby={form.error ? 'add-form-error' : undefined}
            autoComplete="off"
            onChange={form.onChange}
            onBlur={form.onBlur}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown') return
              event.preventDefault()
              descriptionRef.current?.focus()
            }}
          />
          {form.hasRecognized && (
            <span className="add-form__recognized" aria-label="Распознано из текста">
              {form.recognized.due && (
                <span className="add-form__chip">{formatDue(form.recognized.due)}</span>
              )}
              {form.recognized.priority && (
                <span
                  className={cn('add-form__chip', `add-form__chip--${form.recognized.priority}`)}
                >
                  {PRIORITY_LABEL[form.recognized.priority]}
                </span>
              )}
            </span>
          )}
          {!form.text && (
            <span className="add-form__kbd">
              <Kbd>N</Kbd>
            </span>
          )}
        </div>
        <textarea
          ref={descriptionRef}
          className="add-form__description"
          value={form.description}
          placeholder="Добавить описание..."
          aria-label="Описание задачи"
          rows={1}
          onChange={form.onDescriptionChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
            const { selectionStart, selectionEnd } = event.currentTarget
            if (event.key === 'ArrowUp' && selectionStart === 0 && selectionEnd === 0) {
              event.preventDefault()
              rootRef.current?.querySelector<HTMLInputElement>('.add-form__input')?.focus()
            }
          }}
        />
        {form.descriptionCount >= MAX_DESCRIPTION_LENGTH * 0.8 && (
          <span
            className={cn(
              'add-form__description-count',
              form.descriptionCount > MAX_DESCRIPTION_LENGTH && 'add-form__description-count--over',
            )}
          >
            {form.descriptionCount}/{MAX_DESCRIPTION_LENGTH}
          </span>
        )}
        <div className="add-form__bottom">
          <PrioritySelect value={form.priority} onChange={form.setPriority} />
          <DuePicker value={form.due} onChange={form.setDue} />
          <QuickInputHelp
            onPick={(example) => {
              form.fill(example)
              rootRef.current?.querySelector<HTMLInputElement>('.add-form__input')?.focus()
            }}
          />
          <span className="add-form__spacer" />
          {form.showCount && (
            <span className={cn('add-form__count', form.tooLong && 'add-form__count--over')}>
              {form.count}/{MAX_TODO_LENGTH}
            </span>
          )}
          <Button type="submit" className="add-form__submit" disabled={form.tooLong}>
            <PlusIcon width={18} height={18} className="add-form__submit-icon" />
            <span className="add-form__submit-text">Добавить</span>
          </Button>
        </div>
      </form>
      {form.error && (
        <p id="add-form-error" className="add-form__error" role="alert">
          <AlertIcon width={16} height={16} />
          {form.error}
        </p>
      )}
    </div>
  )
}
