import { Button } from '@/shared/ui'

export interface ClearCompletedButtonProps {
  disabled: boolean
  onClear: () => void
}

export const ClearCompletedButton = ({ disabled, onClear }: ClearCompletedButtonProps) => {
  return (
    <Button variant="link" disabled={disabled} onClick={onClear}>
      Очистить выполненные
    </Button>
  )
}
