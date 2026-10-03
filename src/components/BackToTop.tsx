import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

// Floating "back to top" button with a scroll-progress ring; returns to the hero section.
export default function BackToTop() {
  const [show, setShow] = useState(false); const { scrollYProgress } = useScroll()
  useEffect(() => { const f = () => setShow(scrollY > 500); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return (
    <AnimatePresence>{show && (
      <motion.button initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }} whileHover={{ y: -3 }}
        onClick={() => { scrollTo({ top: 0, behavior: 'smooth' }); history.replaceState(null, '', location.pathname) }} aria-label="Back to top (hero section)" title="Back to top"
        className="fixed bottom-4 left-4 z-[70] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-card text-fg shadow-lg backdrop-blur transition-colors hover:border-accent hover:text-accent sm:bottom-5 sm:left-5 sm:h-14 sm:w-14">
        <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden><circle cx="24" cy="24" r="22" fill="none" strokeWidth="2.5" className="stroke-white/10" /><motion.circle cx="24" cy="24" r="22" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: scrollYProgress }} className="stroke-accent" /></svg>
        <ArrowUp size={20} />
      </motion.button>)}</AnimatePresence>)
}
