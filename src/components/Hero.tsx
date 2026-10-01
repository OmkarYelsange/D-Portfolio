import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, FileText, Github, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'

const HeroWorld = lazy(() => import('./HeroWorld'))
const roles = ['Data Analyst', 'Data Engineer', 'Data & ML Enthusiast']
const stack = ['Python', 'SQL', 'Power BI', 'AWS S3', 'Databricks', 'PySpark', 'Medallion Architecture', 'ETL / ELT', 'Excel', 'EDA', 'Machine Learning', 'Gemini API']
const rise = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.65, ease: 'easeOut' as const } })
const icon = 'grid h-10 w-10 place-items-center rounded-full border border-white/15 text-fg2 transition hover:border-accent hover:text-accent'

export default function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % roles.length), 2200); return () => clearInterval(t) }, [])
  return (
    <header id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-[1400px] gap-8 px-6 pt-28 lg:grid-cols-2">
        <div className="pointer-events-auto">
          <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-card px-3 py-1 text-xs text-fg2"><span className="h-2 w-2 animate-pulse rounded-full bg-accent" />Data Analyst · Autoline Industries Ltd.</motion.p>
          <motion.p {...rise(0.1)} className="mt-6 text-2xl text-cyan sm:text-3xl">Hello! I'm</motion.p>
          <motion.h1 {...rise(0.2)} className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl xl:text-8xl">Omkar<br />Yelsange</motion.h1>
          <motion.p {...rise(0.35)} className="mt-5 max-w-[46ch] text-fg2">I build data pipelines, analytics solutions and dashboards that turn raw data into meaningful insights.</motion.p>
          <motion.div {...rise(0.5)} className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 font-semibold text-bg transition hover:brightness-110">Explore my work <ArrowDown size={16} /></a>
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={icon}><Github size={18} /></a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={icon}><Linkedin size={18} /></a>
            <a href={`mailto:${siteConfig.email}`} aria-label="Email" className={icon}><Mail size={18} /></a>
          </motion.div>
        </div>
        <motion.div {...rise(0.4)} className="lg:text-right" aria-label="Roles">
          <p className="text-2xl text-cyan sm:text-3xl">A</p>
          {roles.map((r, k) => <p key={r} className={`text-4xl font-extrabold uppercase leading-[1.05] transition-all duration-500 sm:text-6xl ${k === i ? 'bg-gradient-to-r from-accent via-cyan to-pink bg-clip-text text-transparent' : 'text-fg/25'}`}>{r}</p>)}
        </motion.div>
      </div>
      <div className="pointer-events-none relative z-0 mt-2 h-[320px] w-full lg:absolute lg:inset-x-0 lg:bottom-16 lg:top-[40%] lg:mt-0">
        <Suspense fallback={null}><HeroWorld /></Suspense>
      </div>
      <a href={siteConfig.resume} className="absolute bottom-20 right-8 z-10 hidden items-center gap-2 text-sm tracking-[0.3em] text-muted hover:text-fg lg:flex">RESUME <FileText size={16} /></a>
      <div className="relative z-10 mt-auto overflow-hidden border-y border-white/10 bg-bg/40 py-3 backdrop-blur" aria-hidden>
        <div className="marquee font-mono text-sm text-fg2">{[...stack, ...stack].map((s, k) => <span key={k} className="mx-6">{s} <span className="text-accent">/</span></span>)}</div>
      </div>
    </header>
  )
}
