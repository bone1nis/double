import { Button, EmptyState } from '@/shared/ui'
import { EMPTY_STATES, emptyText } from '../../config/constants'
import type { EmptyKind } from '../../config/constants'

export interface TodoBoardEmptyProps {
  kind: EmptyKind
  query: string
  onAction: () => void
}

export const TodoBoardEmpty = ({ kind, query, onAction }: TodoBoardEmptyProps) => {
  const { Icon, title, action } = EMPTY_STATES[kind]

  return (
    <EmptyState
      icon={<Icon width={22} height={22} />}
      title={title}
      description={emptyText(kind, query)}
      action={
        <Button variant="ghost" onClick={onAction}>
          {action}
        </Button>
      }
    />
  )
}
