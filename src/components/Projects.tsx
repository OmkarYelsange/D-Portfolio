import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Search } from 'lucide-react'
import { TiltCard } from './Motion'
import { projects, type Category } from '../data/projects'

const cats: ('All' | Category)[] = ['All', 'Data Engineering', 'Data Analytics', 'Business Intelligence', 'Machine Learning']

export default function Projects() {
  const [cat, setCat] = useState<(typeof cats)[number]>('All')
  const [q, setQ] = useState('')
  const list = useMemo(() => projects.filter(p =>
    (cat === 'All' || p.category === cat) &&
    [p.title, p.category, ...p.technologies].join(' ').toLowerCase().includes(q.toLowerCase())), [cat, q])
  return (
    <section id="work" className="mx-auto max-w-[1200px] px-6 py-20" aria-labelledby="work-h">
      <h2 id="work-h" className="text-3xl font-bold">Featured work</h2>
      <p className="mt-2 text-fg2">A selection of my work across data analytics, engineering, BI and machine learning.</p>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {cats.map(c => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}
          className={`rounded-full border px-4 py-2 text-sm transition ${cat === c ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-fg2 hover:border-white/30'}`}>{c}</button>)}
        <label className="ml-auto flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm">
          <Search size={14} aria-hidden /><span className="sr-only">Search projects</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects…" className="w-40 bg-transparent outline-none placeholder:text-muted" />
        </label>
      </div>
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {list.map(p => (
            <TiltCard layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-card p-6 transition hover:-translate-y-1 hover:border-accent/50">
              <p className="font-mono text-xs text-cyan">{p.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-fg2">{p.shortDescription}</p>
              <ul className="mt-4 flex flex-wrap gap-2">{p.technologies.map(t => <li key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2">{t}</li>)}</ul>
              <div className="mt-5 flex gap-4 text-sm font-semibold">
                <Link to={`/projects/${p.id}`} className="text-accent">Case study</Link>
                <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-fg2 hover:text-fg">GitHub <ArrowUpRight size={14} /></a>
              </div>
            </TiltCard>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-8 text-fg2">No projects match. Clear the search or pick another category.</p>}
    </section>
  )
}
