import './TodoBoard.scss'
import { ActiveCount } from '@/entities/todo'
import { AddTodoForm } from '@/features/add-todo'
import { ClearCompletedButton } from '@/features/clear-completed'
import { PriorityFilter, TodoFilter } from '@/features/filter-todos'
import { SearchInput } from '@/features/search-todos'
import { useUndoStore } from '@/features/undo-delete'
import { Kbd } from '@/shared/ui'
import { HINTS } from '../../config/constants'
import { useTodoBoard } from '../../model/useTodoBoard'
import { TodoBoardEmpty } from '../TodoBoardEmpty'
import { TodoBoardList } from '../TodoBoardList'

export interface TodoBoardProps {
  selectedId: string | null
  onOpen: (id: string) => void
}

export const TodoBoard = ({ selectedId, onOpen }: TodoBoardProps) => {
  const board = useTodoBoard(selectedId !== null)
  const hasToast = useUndoStore((s) => s.entry !== null)

  return (
    <section className="board" aria-label="Список задач">
      <AddTodoForm onAdd={board.add} inputRef={board.addInputRef} />

      <div className="board__toolbar">
        <TodoFilter value={board.filter} counts={board.counts} onChange={board.setFilter} />
        <div className="board__tools">
          <PriorityFilter value={board.priority} onChange={board.setPriority} />
          <SearchInput
            value={board.query}
            onChange={board.setQuery}
            inputRef={board.searchInputRef}
          />
        </div>
      </div>

      <div className="board__list">
        {board.visible.length === 0 ? (
          <TodoBoardEmpty
            kind={board.emptyKind}
            query={board.query}
            onAction={board.onEmptyAction}
          />
        ) : (
          <TodoBoardList
            todos={board.visible}
            query={board.query}
            onReorder={board.reorder}
            onToggle={board.toggle}
            onRemove={board.remove}
            selectedId={selectedId}
            onOpen={onOpen}
            onMetaChange={board.setMeta}
          />
        )}

        {board.total > 0 && (
          <footer className="board__footer">
            <ActiveCount
              count={board.activeCount}
              found={
                board.isFiltering ? { shown: board.visible.length, total: board.total } : undefined
              }
            />
            <ClearCompletedButton disabled={!board.hasCompleted} onClear={board.clearCompleted} />
          </footer>
        )}
      </div>

      {!hasToast && (
        <ul className="board__hints" aria-label="Горячие клавиши">
          {HINTS.map((hint) => (
            <li key={hint.keys} className="board__hint">
              <Kbd>{hint.keys}</Kbd>
              {hint.text}
            </li>
          ))}
          <li className="board__hint">клик по задаче - открыть</li>
        </ul>
      )}
    </section>
  )
}
