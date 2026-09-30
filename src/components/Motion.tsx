import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>{children}</motion.div>
}

export function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true }); const [v, setV] = useState(0)
  useEffect(() => { if (!inView) return; const c = animate(0, to, { duration: 1.2, onUpdate: x => setV(Math.round(x)) }); return () => c.stop() }, [inView, to])
  return <span ref={ref}>{v}</span>
}

export function TiltCard(props: React.ComponentProps<typeof motion.article>) {
  const reduce = useReducedMotion(); const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 }); const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  return (
    <motion.article {...props} style={{ ...props.style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={e => { if (reduce) return; const b = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - b.left) / b.width - 0.5) * 10); rx.set(-((e.clientY - b.top) / b.height - 0.5) * 10)
        e.currentTarget.style.setProperty('--mx', `${e.clientX - b.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - b.top}px`) }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }} />
  )
}
