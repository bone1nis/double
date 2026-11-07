import { AnimatePresence } from 'motion/react'
import { restoreRemoved } from '../../model/actions'
import { useUndoStore } from '../../model/store'
import { UndoToast } from '../UndoToast'

export const UndoDeleteToast = () => {
  const entry = useUndoStore((s) => s.entry)
  const dismiss = useUndoStore((s) => s.dismiss)

  return (
    <AnimatePresence mode="wait">
      {entry && (
        <UndoToast
          key={entry.id}
          toastId={entry.id}
          label={entry.label}
          name={entry.name}
          onUndo={restoreRemoved}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  )
}
