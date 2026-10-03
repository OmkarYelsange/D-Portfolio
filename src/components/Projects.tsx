import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Search } from 'lucide-react'
import { categories, projects, type Category } from '../data/projects'
import { siteConfig } from '../data/siteConfig'
import { lazy, Suspense } from 'react'
import { TiltCard } from './Motion'

const Globe3D = lazy(() => import('./Scenes').then(m => ({ default: m.Globe3D })))

type Filter = 'All' | Category

export default function Projects() {
  const [cat, setCat] = useState<Filter>('All')
  const [q, setQ] = useState('')
  const list = useMemo(() => projects.filter(p =>
    (cat === 'All' || p.category === cat) &&
    [p.title, p.category, p.shortDescription, ...p.technologies].join(' ').toLowerCase().includes(q.toLowerCase())), [cat, q])
  const count = (c: Filter) => (c === 'All' ? projects.length : projects.filter(p => p.category === c).length)
  return (
    <section id="work" className="relative mx-auto max-w-[1400px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="work-h">
      <div className="pointer-events-none absolute right-6 top-2 hidden h-48 w-48 lg:block xl:right-16"><Suspense fallback={null}><Globe3D /></Suspense></div>
      <p className="font-mono text-xs text-cyan">SELECTED WORK</p>
      <h2 id="work-h" className="mt-2 text-2xl font-bold sm:text-3xl">Projects from my GitHub</h2>
      <p className="mt-2 max-w-[65ch] text-fg2">Data analytics, data engineering, software / web development and hardware projects, in that order. Each one has a case study with the problem, approach, solution, result, benefits and how it differs from usual methods.</p>
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {(['All', ...categories] as Filter[]).map(c => (
            <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition sm:px-4 sm:py-2 sm:text-sm ${cat === c ? 'border-accent bg-accent/15 text-accent' : 'border-white/10 text-fg2 hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg'}`}>
              {c} <span className="ml-1 font-mono text-xs opacity-60">{count(c)}</span>
            </button>))}
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-card px-3 py-2 text-sm transition focus-within:border-accent lg:ml-auto">
          <Search size={14} aria-hidden /><span className="sr-only">Search projects</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects or tools…" className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted lg:w-52" />
        </label>
      </div>
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {list.map(p => (
            <TiltCard layout key={p.id} initial={{ opacity: 0, y: 50, scale: 0.92, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-40px' }} exit={{ opacity: 0, scale: 0.95 }} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card transition-colors hover:border-accent/60">
              <Link to={`/projects/${p.id}`} className="relative block aspect-[16/10] overflow-hidden bg-bg2" aria-label={`Open case study: ${p.title}`}>
                <img src={p.cover} alt={p.coverIsReal ? `Screenshot of the ${p.title} project` : `Illustrative cover for ${p.title}`} loading="lazy" decoding="async" width={1200} height={750}
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-70 transition group-hover:opacity-40" aria-hidden />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">{p.category}</span>
                {!p.coverIsReal && <span className="absolute bottom-2 right-3 text-[10px] text-white/70">Illustrative cover</span>}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-fg2">{p.shortDescription}</p>
                <ul className="mt-4 flex flex-wrap gap-2">{p.technologies.slice(0, 5).map(t => <li key={t} className="chip rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2">{t}</li>)}{p.technologies.length > 5 && <li className="px-1 py-1 font-mono text-xs text-muted">+{p.technologies.length - 5}</li>}</ul>
                <div className="mt-5 flex items-center gap-4 text-sm font-semibold">
                  <Link to={`/projects/${p.id}`} className="u-link text-accent">Case study →</Link>
                  {p.private || !p.github ? <span className="text-xs text-muted">Private repository</span> : <a href={p.github} target="_blank" rel="noreferrer" className="u-link inline-flex items-center gap-1 text-fg2 hover:text-fg">GitHub <ArrowUpRight size={14} /></a>}
                </div>
              </div>
            </TiltCard>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-8 text-fg2">No projects match. Clear the search or pick another category.</p>}
      <p className="mt-8 text-sm text-fg2">There are more repositories (web apps, clones and practice work) on <a className="u-link text-accent" href={siteConfig.social.github} target="_blank" rel="noreferrer">my GitHub profile</a>.</p>
    </section>
  )
}
