import './TodoTextView.scss'
import { cn } from '@/shared/lib'

export interface TodoTextViewProps {
  text: string
  description: string
  done: boolean
  query: string
  onOpen: () => void
}

const splitByQuery = (text: string, query: string): { value: string; match: boolean }[] => {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [{ value: text, match: false }]
  const lower = text.toLowerCase()
  const parts: { value: string; match: boolean }[] = []
  let pos = 0
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, pos)) {
    if (at > pos) parts.push({ value: text.slice(pos, at), match: false })
    parts.push({ value: text.slice(at, at + needle.length), match: true })
    pos = at + needle.length
  }
  if (pos < text.length) parts.push({ value: text.slice(pos), match: false })
  return parts
}

const Highlighted = ({ text, query }: { text: string; query: string }) =>
  splitByQuery(text, query).map((part, index) =>
    part.match ? (
      <mark key={index} className="todo-text__mark">
        {part.value}
      </mark>
    ) : (
      <span key={index}>{part.value}</span>
    ),
  )

export const TodoTextView = ({ text, description, done, query, onOpen }: TodoTextViewProps) => (
  <div className={cn('todo-text', done && 'todo-text--done')} onClick={onOpen}>
    <div className="todo-text__title">
      <Highlighted text={text} query={query} />
    </div>
    {description && (
      <p className="todo-text__description">
        <Highlighted text={description} query={query} />
      </p>
    )}
  </div>
)
