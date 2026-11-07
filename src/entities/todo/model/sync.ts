import { STORAGE_KEY, useTodoStore } from './store'

export const syncTodosAcrossTabs = (): (() => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) void useTodoStore.persist.rehydrate()
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
