import './UndoToast.scss'
import { m } from 'motion/react'
import { useEffect } from 'react'
import { CloseIcon, UndoIcon } from '@/shared/assets'
import { UNDO_TIMEOUT_MS } from '../../config/constants'

export interface UndoToastProps {
  toastId: number
  label: string
  name: string
  onUndo: () => void
  onDismiss: () => void
}

export const UndoToast = ({ toastId, label, name, onUndo, onDismiss }: UndoToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, UNDO_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [toastId, onDismiss])

  return (
    <m.div
      className="undo-toast"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="undo-toast__message">
        <span className="undo-toast__label">{label}</span>
        {name && <span className="undo-toast__name">{name}</span>}
      </span>
      <button type="button" className="undo-toast__undo" onClick={onUndo}>
        <UndoIcon width={16} height={16} />
        Отменить
      </button>
      <button type="button" className="undo-toast__close" aria-label="Закрыть" onClick={onDismiss}>
        <CloseIcon width={16} height={16} />
      </button>
      <span
        key={toastId}
        className="undo-toast__timer"
        style={{ animationDuration: `${UNDO_TIMEOUT_MS}ms` }}
      />
    </m.div>
  )
}
