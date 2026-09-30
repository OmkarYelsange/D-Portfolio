import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export function Loader() {
  const [show, setShow] = useState(() => { if (reduced()) return false; try { return sessionStorage.getItem('seen') !== '1' } catch { return false } })
  useEffect(() => { if (!show) return; const t = setTimeout(() => { setShow(false); try { sessionStorage.setItem('seen', '1') } catch { /* ignore */ } }, 1000); return () => clearTimeout(t) }, [show])
  return (
    <AnimatePresence>{show && (
      <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg" role="status" aria-label="Loading portfolio">
        <p className="font-extrabold tracking-tight">OMKAR YELSANGE</p><p className="mt-2 font-mono text-xs text-muted">Initializing portfolio…</p>
        <div className="mt-4 h-0.5 w-48 overflow-hidden rounded bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.9, ease: 'easeInOut' }} className="h-full bg-accent" /></div>
      </motion.div>)}</AnimatePresence>)
}

// Desktop-only follower ring; the native cursor stays visible for accessibility.
export function Cursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced()
  const x = useMotionValue(-100), y = useMotionValue(-100); const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [mode, setMode] = useState<'idle' | 'link' | 'view'>('idle')
  useEffect(() => {
    if (!fine) return
    const mv = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); const t = (e.target as HTMLElement).closest('article,a,button,input,textarea,[role=option]'); setMode(!t ? 'idle' : t.tagName === 'ARTICLE' ? 'view' : 'link') }
    addEventListener('pointermove', mv); return () => removeEventListener('pointermove', mv)
  }, [fine, x, y])
  if (!fine) return null
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[90]">
      <motion.div animate={{ scale: mode === 'idle' ? 1 : mode === 'link' ? 2.2 : 3.2 }} className="-ml-2 -mt-2 h-4 w-4 rounded-full border border-accent bg-accent/20" />
      {mode === 'view' && <span className="absolute left-5 top-5 rounded bg-accent px-1.5 text-[10px] font-bold text-bg">VIEW</span>}
    </motion.div>)
}
