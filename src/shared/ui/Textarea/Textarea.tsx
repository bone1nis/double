import './Textarea.scss'
import { useId } from 'react'
import type { Ref, TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string | null
  textareaRef?: Ref<HTMLTextAreaElement>
  count?: number
  limit?: number
}

export const Textarea = ({
  label,
  error,
  className,
  textareaRef,
  count,
  limit,
  ...rest
}: TextareaProps) => {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        rows={2}
        className={cn('textarea', error && 'textarea--invalid', className)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {count !== undefined && limit !== undefined && count >= limit * 0.8 && (
        <p className={cn('field__count', count > limit && 'field__count--over')}>
          {count}/{limit}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
