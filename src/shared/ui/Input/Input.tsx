import './Input.scss'
import { useId } from 'react'
import type { InputHTMLAttributes, Ref } from 'react'
import { cn } from '@/shared/lib'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string | null
  inputRef?: Ref<HTMLInputElement>
}

export const Input = ({ label, error, className, inputRef, ...rest }: InputProps) => {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        className={cn('input', error && 'input--invalid', className)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
