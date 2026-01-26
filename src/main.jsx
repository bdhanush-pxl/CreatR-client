import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
    <main className='bg-slate-900 min-h-screen text-white overflow-x-hidden'>
      <App />
    </main>
    </ThemeProvider>
  </StrictMode>,
)
