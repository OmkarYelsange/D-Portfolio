import { useEffect, useState } from 'react'
import { Menu, Moon, Sparkles, Sun, Terminal, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { siteConfig } from '../data/siteConfig'

const links = [['About', 'about'], ['Work', 'work'], ['Skills', 'skills'], ['Experience', 'experience'], ['Contact', 'contact']]
const fire = (n: string) => () => window.dispatchEvent(new Event(n))
const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-fg2 transition hover:border-accent hover:text-fg'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, toggle] = useTheme()
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav aria-label="Main" className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? 'border-b border-white/10 bg-bg/80 backdrop-blur' : ''}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight" aria-label="Omkar Yelsange, home"><span className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-accent via-cyan to-pink ring-2 ring-accent/50"><img src="/images/omkar-avatar.webp" alt="" width={36} height={36} className="h-full w-full object-cover" /></span><span>OY<span className="text-accent">.</span></span></a>
        <a href={`mailto:${siteConfig.email}`} className="hidden rounded-full border border-white/10 bg-card px-4 py-1.5 text-sm text-fg2 hover:text-fg xl:block">{siteConfig.email}</a>
        <ul className="ml-auto hidden items-center gap-6 text-sm text-fg2 md:flex">
          {links.map(([l, id]) => <li key={id}><a className="u-link hover:text-fg" href={`/#${id}`}>{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <button className={`${btn} hidden sm:inline-flex`} onClick={fire('toggle-terminal')} aria-label="Open terminal"><Terminal size={14} /><span className="hidden lg:inline">Terminal</span></button>
          <button className={`${btn} hidden sm:inline-flex`} onClick={fire('toggle-assistant')} aria-label="Ask the AI assistant"><Sparkles size={14} /><span className="hidden lg:inline">Ask AI</span></button>
          <button className="rounded-lg p-2 text-fg2 hover:text-fg" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="p-2 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <ul className="border-t border-white/10 px-6 pb-4 md:hidden">
        {links.map(([l, id]) => <li key={id}><a onClick={() => setOpen(false)} className="block py-3 text-lg" href={`/#${id}`}>{l}</a></li>)}
        <li className="flex gap-2 pt-2"><button className={btn} onClick={() => { setOpen(false); fire('toggle-terminal')() }}><Terminal size={14} />Terminal</button><button className={btn} onClick={() => { setOpen(false); fire('toggle-assistant')() }}><Sparkles size={14} />Ask AI</button></li>
      </ul>}
    </nav>
  )
}
