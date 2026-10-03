import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Send, Sparkles, X } from 'lucide-react'
import { askAssistant, groups, predefined, type Msg } from '../lib/assistant'

const hello: Msg = { role: 'assistant', text: "Hi! I'm Omkar's AI assistant. Pick a question below or ask anything about his experience, projects, skills or education." }
const popular = predefined.filter(p => p.pop)

export default function AssistantChat() {
  const [open, setOpen] = useState(false); const [msgs, setMsgs] = useState<Msg[]>([hello]); const [val, setVal] = useState(''); const [busy, setBusy] = useState(false); const [all, setAll] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tog = () => setOpen(o => !o); const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('toggle-assistant', tog); addEventListener('keydown', esc); return () => { removeEventListener('toggle-assistant', tog); removeEventListener('keydown', esc) }
  }, [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, open])
  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return
    const next: Msg[] = [...msgs.filter(m => m !== hello), { role: 'user', text: q }]; setMsgs([hello, ...next]); setVal(''); setBusy(true); setAll(false)
    const [a] = await Promise.all([askAssistant(next), new Promise(r => setTimeout(r, 450))])
    setMsgs(m => [...m, { role: 'assistant', text: a }]); setBusy(false)
  }
  return (
    <>
      <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} className="btn-shine fixed bottom-4 right-4 z-[70] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan text-bg shadow-lg sm:bottom-5 sm:right-5 sm:h-14 sm:w-14">{open ? <X /> : <Sparkles />}</button>
      <AnimatePresence>{open && (
        <motion.section role="dialog" aria-label="AI assistant" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-[4.75rem] right-2 z-[70] flex h-[min(600px,calc(100dvh-6.5rem))] w-[min(420px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-bg2 shadow-2xl sm:bottom-24 sm:right-3">
          <header className="flex items-center gap-2 border-b border-white/10 bg-gradient-to-r from-accent/20 to-cyan/10 px-4 py-3"><Sparkles size={16} className="text-accent" /><div className="min-w-0"><p className="text-sm font-semibold">Ask about Omkar</p><p className="truncate text-xs text-muted">AI assistant · {predefined.length} ready answers + any custom question</p></div></header>
          <div className="flex-1 space-y-3 overflow-auto px-4 py-3" aria-live="polite">
            {msgs.map((m, i) => <p key={i} className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-accent text-bg' : 'bg-card text-fg'}`}>{m.text}</p>)}
            {busy && <p className="w-fit rounded-2xl bg-card px-3 py-2 text-sm text-muted" role="status">Thinking…</p>}
            <div ref={end} />
          </div>
          {all && <div className="max-h-48 space-y-3 overflow-auto border-t border-white/10 bg-bg px-3 py-3">
            {groups.map(g => <div key={g}><p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted">{g}</p><div className="flex flex-wrap gap-1.5">{predefined.filter(p => p.group === g).map(p => <button key={p.q} onClick={() => send(p.q)} className="chip rounded-full border border-white/15 px-2.5 py-1 text-left text-xs text-fg2">{p.q}</button>)}</div></div>)}
          </div>}
          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
            <div className="flex flex-1 gap-2 overflow-x-auto">{popular.map(p => <button key={p.q} onClick={() => send(p.q)} className="chip shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs text-fg2">{p.q}</button>)}</div>
            <button onClick={() => setAll(a => !a)} aria-expanded={all} className="chip inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/40 px-2.5 py-1 text-xs text-accent">All<ChevronDown size={12} className={all ? 'rotate-180' : ''} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); send(val) }} className="flex gap-2 border-t border-white/10 p-3">
            <input value={val} onChange={e => setVal(e.target.value)} maxLength={300} placeholder="Ask anything about Omkar…" aria-label="Your question" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-accent" />
            <button type="submit" disabled={busy || !val.trim()} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-bg disabled:opacity-50"><Send size={16} /></button>
          </form>
        </motion.section>)}</AnimatePresence>
    </>)
}
