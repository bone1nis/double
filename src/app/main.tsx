import { createRoot } from 'react-dom/client'
import './styles/global.scss'
import { syncTodosAcrossTabs } from '@/entities/todo'
import App from './App'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

syncTodosAcrossTabs()

createRoot(container).render(<App />)
