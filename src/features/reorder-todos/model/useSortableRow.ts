import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const useSortableRow = (id: string) => {
  const sortable = useSortable({ id })

  const rowProps = {
    ref: sortable.setNodeRef,
    style: {
      transform: CSS.Transform.toString(sortable.transform),
      transition: sortable.transition,
    },
    'data-dragging': sortable.isDragging || undefined,
  }

  const handleProps = {
    ref: sortable.setActivatorNodeRef,
    ...sortable.attributes,
    ...sortable.listeners,
  }

  return { rowProps, handleProps }
}
