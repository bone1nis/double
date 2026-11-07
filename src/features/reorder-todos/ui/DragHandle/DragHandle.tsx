import './DragHandle.scss'
import type { ButtonHTMLAttributes } from 'react'
import { GripIcon } from '@/shared/assets'
import { Button } from '@/shared/ui'

export const DragHandle = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button variant="icon" className="drag-handle" {...props}>
    <GripIcon width={18} height={18} />
  </Button>
)
