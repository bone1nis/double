import './Drawer.scss'
import { useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/shared/assets'
import { Button } from '../Button'

export interface DrawerProps {
  label: string
  header: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export const Drawer = ({ label, header, onClose, children, footer }: DrawerProps) => {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => root?.removeAttribute('inert')
  }, [])

  useEffect(() => {
    const previous = document.activeElement
    panelRef.current?.focus()
    return () => {
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  useEffect(() => {
    const { overflow, paddingRight } = document.body.style
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [])

  const requestClose = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    onClose()
  }, [onClose])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) requestClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  return createPortal(
    <div className="drawer">
      <m.div
        className="drawer__overlay"
        onClick={requestClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        transition={{ duration: 0.2 }}
      />
      <m.aside
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0, transition: { duration: 0.18 } }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="drawer__header">
          <div className="drawer__heading">{header}</div>
          <Button variant="icon" aria-label="Закрыть панель" onClick={requestClose}>
            <CloseIcon width={18} height={18} />
          </Button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__footer">{footer}</footer>}
      </m.aside>
    </div>,
    document.body,
  )
}
