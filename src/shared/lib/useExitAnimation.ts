import { useState } from 'react'

export const useExitAnimation = (onExited: () => void) => {
  const [isLeaving, setIsLeaving] = useState(false)

  return {
    isLeaving,
    startExit: () => setIsLeaving(true),
    onAnimationEnd: () => isLeaving && onExited(),
  }
}
