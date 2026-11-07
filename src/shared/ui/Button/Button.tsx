import './Button.scss'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '@/shared/lib'

export type ButtonVariant = 'primary' | 'ghost' | 'icon' | 'danger' | 'tool' | 'link'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  ref?: Ref<HTMLButtonElement>
}

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button type={type} className={cn('btn', `btn--${variant}`, className)} {...rest} />
)
