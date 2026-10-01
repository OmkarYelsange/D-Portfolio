import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { experience } from '../data/experience'
import { education } from '../data/education'
import { siteConfig } from '../data/siteConfig'
import { askAssistant } from '../lib/assistant'

type Line = { k: 'in' | 'out' | 'err'; t: string }
type Cmd = (a: string[]) => string[] | Promise<string[]> | void
const sections = ['about', 'work', 'skills', 'experience', 'education', 'github', 'contact']
const banner: Line[] = ['Omkar Yelsange: Data Analyst · Data Engineer · Data & ML Enthusiast', "Type 'help' for commands. Try: projects, goto experience, ask what is your current role", ''].map(t => ({ k: 'out', t }))

export default function Terminal() {
  const [open, setOpen] = useState(false); const [lines, setLines] = useState<Line[]>(banner); const [val, setVal] = useState('')
  const hist = useRef<string[]>([]); const hi = useRef(-1); const inp = useRef<HTMLInputElement>(null); const end = useRef<HTMLDivElement>(null); const nav = useNavigate()
  const go = (id: string) => { nav('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120) }
  const theme = (t: 'dark' | 'light') => window.dispatchEvent(new CustomEvent('set-theme', { detail: t }))
  const show = (id: string, out: string[]): Cmd => () => { go(id); return out }

  const cmds: Record<string, Cmd> = {
    help: () => ['about · work · skills · experience · education · contact   print a section and jump to it', 'projects                 list projects      open <id>   open a case study', 'goto <section>          ' + sections.join(' | '), 'ask <question>          ask the AI assistant', 'theme dark|light        resume · github · linkedin · neofetch · clear · exit', 'Tab autocompletes, ↑/↓ browse history.'],
    whoami: () => ['omkar: Data Analyst @ Autoline Industries Ltd. (June 2026 – present)'],
    neofetch: () => ['  ┌──────────┐   omkar@portfolio', '  │ ▂ ▅ ▇ ▆ │   ───────────────', '  │ DATA LAB │   role: Data Analyst | Data Engineer', '  └──────────┘   stack: Python, SQL, Power BI, Databricks, PySpark, AWS', '                 location: Pune, India'],
    about: show('about', ['Data Analyst at Autoline Industries Ltd. B.E. Robotics & Automation Engineering. Interested in turning raw data into reliable pipelines, dashboards and decisions.']),
    work: show('work', projects.map(p => `${p.id.padEnd(10)} ${p.title}`)),
    projects: () => [...projects.map(p => `${p.id.padEnd(10)} ${p.title} [${p.category}]`), '', 'open <id> to view a case study'],
    skills: show('skills', Object.entries(skills).map(([g, i]) => `${g.padEnd(17)} ${i.join(', ')}`)),
    experience: show('experience', experience.map(e => `${(e.dates || 'dates n/a').padEnd(22)} ${e.role} @ ${e.company}`)),
    education: show('education', education.map(e => `${e.years.padEnd(13)} ${e.degree}: ${e.school} (${e.score})`)),
    contact: show('contact', [`email     ${siteConfig.email}`, `github    ${siteConfig.social.github}`, `linkedin  ${siteConfig.social.linkedin}`]),
    goto: a => { const id = a[0]?.toLowerCase(); if (!id || !sections.includes(id)) return ['usage: goto <' + sections.join('|') + '>']; go(id); return [`→ ${id}`] },
    open: a => { const p = projects.find(x => x.id === a[0]?.toLowerCase()); if (!p) return ['usage: open <id>  (run `projects` for ids)']; nav(`/projects/${p.id}`); setOpen(false); return [] },
    theme: a => { if (a[0] !== 'dark' && a[0] !== 'light') return ['usage: theme dark|light']; theme(a[0]); return [`theme set to ${a[0]}`] },
    resume: () => { window.open(siteConfig.resume); return ['opening resume…'] },
    github: () => { window.open(siteConfig.social.github); return ['opening GitHub…'] },
    linkedin: () => { window.open(siteConfig.social.linkedin); return ['opening LinkedIn…'] },
    ask: async a => { if (!a.length) return ['usage: ask <question>']; return (await askAssistant([{ role: 'user', text: a.join(' ') }])).split('\n') },
    clear: () => { setLines([]) },
    exit: () => { setOpen(false) },
  }

  async function run(raw: string) {
    const text = raw.trim(); setLines(l => [...l, { k: 'in', t: text }]); if (!text) return
    hist.current.unshift(text); hi.current = -1
    const [c, ...a] = text.split(/\s+/); const fn = cmds[c.toLowerCase()]
    if (!fn) return setLines(l => [...l, { k: 'err', t: `command not found: ${c}. Type 'help'.` }])
    const r = await fn(a); if (Array.isArray(r)) setLines(l => [...l, ...r.map(t => ({ k: 'out' as const, t }))])
  }
  useEffect(() => {
    const tog = () => setOpen(o => !o)
    const key = (e: KeyboardEvent) => { const tag = (e.target as HTMLElement).tagName; if (e.key === '`' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); tog() } if (e.key === 'Escape') setOpen(false) }
    addEventListener('toggle-terminal', tog); addEventListener('keydown', key); return () => { removeEventListener('toggle-terminal', tog); removeEventListener('keydown', key) }
  }, [])
  useEffect(() => { if (open) setTimeout(() => inp.current?.focus(), 150) }, [open])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [lines, open])

  return (
    <AnimatePresence>{open && (
      <motion.div role="dialog" aria-label="Terminal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed inset-x-0 bottom-0 z-[80] mx-auto flex h-[52vh] max-h-[480px] max-w-[1000px] flex-col overflow-hidden rounded-t-xl border border-white/15 bg-[#0b0b14]/95 font-mono text-sm text-[#d6d9f5] shadow-2xl backdrop-blur" onClick={() => inp.current?.focus()}>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2"><span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" /><span className="ml-3 text-xs text-[#8f93b8]">omkar@portfolio: ~</span><button aria-label="Close terminal" onClick={() => setOpen(false)} className="ml-auto text-[#8f93b8] hover:text-white"><X size={16} /></button></div>
        <div className="flex-1 overflow-auto px-4 py-3" aria-live="polite">
          {lines.map((l, i) => <pre key={i} className={`whitespace-pre-wrap break-words font-mono ${l.k === 'in' ? 'text-white' : l.k === 'err' ? 'text-[#ff8a8a]' : 'text-[#c4c8ee]'}`}>{l.k === 'in' ? <><span className="text-[#8B7CFF]">$ </span>{l.t}</> : l.t}</pre>)}
          <div className="flex items-center gap-2"><span className="text-[#8B7CFF]">$</span>
            <input ref={inp} value={val} onChange={e => setVal(e.target.value)} aria-label="Terminal input" autoComplete="off" spellCheck={false} className="flex-1 bg-transparent text-white outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') { run(val); setVal('') }
                else if (e.key === 'ArrowUp') { e.preventDefault(); hi.current = Math.min(hi.current + 1, hist.current.length - 1); setVal(hist.current[hi.current] ?? '') }
                else if (e.key === 'ArrowDown') { e.preventDefault(); hi.current = Math.max(hi.current - 1, -1); setVal(hist.current[hi.current] ?? '') }
                else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(cmds).find(c => val && !val.includes(' ') && c.startsWith(val.toLowerCase())); if (m) setVal(m + ' ') }
              }} /></div>
          <div ref={end} />
        </div>
      </motion.div>)}</AnimatePresence>)
}
