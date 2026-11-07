import './EmptyState.scss'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="empty">
      {icon && (
        <div className="empty__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="empty__title">{title}</h2>
      <p className="empty__text">{description}</p>
      {action && <div className="empty__action">{action}</div>}
    </div>
  )
}
