import { useEffect, useState } from 'react'
type Theme = 'dark' | 'light'
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F1EFFB' : '#0A0A12')
  }, [theme])
  useEffect(() => { const h = (e: Event) => setTheme((e as CustomEvent<Theme>).detail); addEventListener('set-theme', h); return () => removeEventListener('set-theme', h) }, [])
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))] as const
}
