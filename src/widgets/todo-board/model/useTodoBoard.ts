import { useCallback, useMemo, useRef, useState } from 'react'
import { countActive, useTodoStore } from '@/entities/todo'
import { filterByPriority, filterTodos } from '@/features/filter-todos'
import type { Filter, PriorityFilterValue } from '@/features/filter-todos'
import { searchTodos } from '@/features/search-todos'
import { clearCompletedWithUndo, removeTodoWithUndo } from '@/features/undo-delete'
import { useHotkey } from '@/shared/lib'
import type { EmptyKind } from '../config/constants'

const NEW_KEYS = ['n', 'т']
const SEARCH_KEYS = ['/', '.']
export const useTodoBoard = (panelOpen: boolean) => {
  const { todos, add, toggle, setMeta, reorder } = useTodoStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [priority, setPriority] = useState<PriorityFilterValue>('all')
  const [query, setQuery] = useState('')
  const addInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(
    () => searchTodos(filterByPriority(filterTodos(todos, filter), priority), query),
    [todos, filter, priority, query],
  )
  const activeCount = countActive(todos)
  const isSearching = query.trim() !== ''
  const isFiltering = isSearching || priority !== 'all'

  const focusAdd = useCallback(() => addInputRef.current?.focus(), [])
  useHotkey(
    NEW_KEYS,
    useCallback(() => {
      if (!panelOpen) focusAdd()
    }, [panelOpen, focusAdd]),
  )
  useHotkey(
    SEARCH_KEYS,
    useCallback(() => {
      if (!panelOpen) searchInputRef.current?.focus()
    }, [panelOpen]),
  )

  const emptyKind: EmptyKind =
    todos.length === 0
      ? 'all'
      : isSearching
        ? 'search'
        : priority !== 'all'
          ? 'priority'
          : filter === 'all'
            ? 'completed'
            : filter

  const onEmptyAction = () => {
    if (emptyKind === 'all') return focusAdd()
    if (emptyKind === 'search') return setQuery('')
    if (emptyKind === 'priority') return setPriority('all')
    setFilter('all')
  }

  return {
    counts: { all: todos.length, active: activeCount, completed: todos.length - activeCount },
    total: todos.length,
    visible,
    filter,
    setFilter,
    query,
    setQuery,
    isSearching,
    isFiltering,
    priority,
    setPriority,
    emptyKind,
    onEmptyAction,
    activeCount,
    hasCompleted: activeCount < todos.length,
    addInputRef,
    searchInputRef,
    add,
    toggle,
    remove: removeTodoWithUndo,
    setMeta,
    reorder,
    clearCompleted: clearCompletedWithUndo,
  }
}
