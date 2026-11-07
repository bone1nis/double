import './Kbd.scss'
import type { ReactNode } from 'react'

export interface KbdProps {
  children: ReactNode
}

export const Kbd = ({ children }: KbdProps) => <kbd className="kbd">{children}</kbd>
