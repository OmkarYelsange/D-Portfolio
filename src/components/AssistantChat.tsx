import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles, X } from 'lucide-react'
import { askAssistant, predefined, type Msg } from '../lib/assistant'

const hello: Msg = { role: 'assistant', text: "Hi! I'm Omkar's AI assistant. Pick a question below or ask your own about his experience, projects, skills or education." }

export default function AssistantChat() {
  const [open, setOpen] = useState(false); const [msgs, setMsgs] = useState<Msg[]>([hello]); const [val, setVal] = useState(''); const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tog = () => setOpen(o => !o); const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('toggle-assistant', tog); addEventListener('keydown', esc); return () => { removeEventListener('toggle-assistant', tog); removeEventListener('keydown', esc) }
  }, [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, open])
  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return
    const next: Msg[] = [...msgs.filter(m => m !== hello), { role: 'user', text: q }]; setMsgs([hello, ...next]); setVal(''); setBusy(true)
    const [a] = await Promise.all([askAssistant(next), new Promise(r => setTimeout(r, 450))])
    setMsgs(m => [...m, { role: 'assistant', text: a }]); setBusy(false)
  }
  return (
    <>
      <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} className="fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan text-bg shadow-lg transition hover:scale-105">{open ? <X /> : <Sparkles />}</button>
      <AnimatePresence>{open && (
        <motion.section role="dialog" aria-label="AI assistant" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-3 z-[70] flex h-[min(560px,75vh)] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-bg2 shadow-2xl">
          <header className="flex items-center gap-2 border-b border-white/10 bg-gradient-to-r from-accent/20 to-cyan/10 px-4 py-3"><Sparkles size={16} className="text-accent" /><div><p className="text-sm font-semibold">Ask about Omkar</p><p className="text-xs text-muted">AI assistant · answers from his portfolio info</p></div></header>
          <div className="flex-1 space-y-3 overflow-auto px-4 py-3" aria-live="polite">
            {msgs.map((m, i) => <p key={i} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-accent text-bg' : 'bg-card text-fg'}`}>{m.text}</p>)}
            {busy && <p className="w-fit rounded-2xl bg-card px-3 py-2 text-sm text-muted" role="status">Thinking…</p>}
            <div ref={end} />
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-3 py-2">{predefined.map(p => <button key={p.q} onClick={() => send(p.q)} className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs text-fg2 hover:border-accent hover:text-fg">{p.q}</button>)}</div>
          <form onSubmit={e => { e.preventDefault(); send(val) }} className="flex gap-2 border-t border-white/10 p-3">
            <input value={val} onChange={e => setVal(e.target.value)} maxLength={300} placeholder="Ask anything about Omkar…" aria-label="Your question" className="flex-1 rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-accent" />
            <button type="submit" disabled={busy || !val.trim()} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-bg disabled:opacity-50"><Send size={16} /></button>
          </form>
        </motion.section>)}</AnimatePresence>
    </>)
}
