import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'

const Hero3D = lazy(() => import('./Hero3D'))
const rise = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.65, ease: 'easeOut' as const } })
const flow: [string, string][] = [['Raw Data', 'APIs · CSV · Databases'], ['AWS S3', 'raw files'], ['Databricks', 'bronze → silver → gold'], ['SQL / PySpark', 'transform'], ['Power BI', 'dashboards']]

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-28">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.p {...rise(0)} className="text-fg2">Hi, I'm</motion.p>
            <motion.h1 {...rise(0.1)} className="mt-2 text-5xl font-extrabold tracking-tight sm:text-7xl">{siteConfig.name}</motion.h1>
            <motion.p {...rise(0.25)} className="mt-6 bg-gradient-to-r from-accent via-cyan to-pink bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">Data Analyst · Data Engineer · Data &amp; ML Enthusiast</motion.p>
            <motion.p {...rise(0.4)} className="mt-6 max-w-[60ch] text-fg2">{siteConfig.description}</motion.p>
            <motion.div {...rise(0.55)} className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 font-semibold text-bg transition hover:brightness-110">Explore my work <ArrowDown size={16} /></a>
              <a href={siteConfig.resume} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold hover:border-accent/60"><Download size={16} /> Download resume</a>
            </motion.div>
            <motion.p {...rise(0.7)} className="mt-8 text-sm text-muted">{siteConfig.location} · Data Analyst, Data Engineer, Data Science / ML roles</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9 }}>
            <Suspense fallback={<div className="h-[340px] sm:h-[440px]" />}><Hero3D /></Suspense>
          </motion.div>
        </div>
        <ol className="mt-12 flex flex-col items-stretch md:flex-row md:items-center" aria-label="Data pipeline">
          {flow.map(([t, s], i) => (
            <li key={t} className={`flex flex-col items-center md:flex-row ${i < flow.length - 1 ? "md:flex-1" : "md:flex-none"}`}>
              <motion.div {...rise(0.9 + i * 0.12)} className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 font-mono text-sm hover:border-accent/50 md:w-auto"><div>{t}</div><div className="text-xs text-muted">{s}</div></motion.div>
              {i < flow.length - 1 && <span aria-hidden className="flow-v my-1 h-6 w-px md:flow-h md:mx-2 md:my-0 md:h-px md:w-auto md:flex-1" />}
            </li>))}
        </ol>
      </div>
    </header>
  )
}
