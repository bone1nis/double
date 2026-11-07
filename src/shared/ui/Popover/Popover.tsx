import './Popover.scss'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { createPortal } from 'react-dom'

export interface PopoverProps {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  label: string
  align?: 'start' | 'end'
  onClose: () => void
  children: ReactNode
}

const GAP = 6
const MARGIN = 8

export const Popover = ({
  open,
  anchorRef,
  label,
  align = 'start',
  onClose,
  children,
}: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const element = ref.current
    if (!open || !anchor || !element) return
    element.style.maxHeight = ''
    const rect = anchor.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = element
    const wanted = align === 'end' ? rect.right - width : rect.left
    const left = Math.max(MARGIN, Math.min(wanted, window.innerWidth - width - MARGIN))
    const spaceBelow = window.innerHeight - rect.bottom - GAP - MARGIN
    const spaceAbove = rect.top - GAP - MARGIN
    const placeBelow = height <= spaceBelow || (height > spaceAbove && spaceBelow >= spaceAbove)
    const space = placeBelow ? spaceBelow : spaceAbove
    const fitted = Math.min(height, Math.max(space, 0))
    element.style.maxHeight = `${fitted}px`
    element.style.left = `${left}px`
    element.style.top = `${placeBelow ? rect.bottom + GAP : rect.top - GAP - fitted}px`
    element.style.visibility = 'visible'
  }, [open, anchorRef, align])

  useEffect(() => {
    if (!open) return
    const element = ref.current
    const anchor = anchorRef.current
    element
      ?.querySelector<HTMLElement>('button:not([disabled]), input:not([disabled])')
      ?.focus({ preventScroll: true })
    return () => {
      if (element?.contains(document.activeElement)) anchor?.focus()
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (ref.current?.contains(event.target) || anchorRef.current?.contains(event.target)) return
      onClose()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
      anchorRef.current?.focus()
    }
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && ref.current?.contains(event.target)) return
      onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('resize', onClose)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('resize', onClose)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, anchorRef, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          className="popover"
          role="dialog"
          aria-label={label}
          onBlur={(event) => {
            const next = event.relatedTarget
            if (!(next instanceof Node)) return
            if (event.currentTarget.contains(next) || anchorRef.current?.contains(next)) return
            onClose()
          }}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.14 }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
