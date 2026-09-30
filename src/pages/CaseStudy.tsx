import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import { DashboardPreview } from '../components/Extras'
import DataPipeline, { type PipelineNodeData } from '../components/DataPipeline'

const goodcabsArch: PipelineNodeData[] = [
  { id: 's3', label: 'AWS S3', sub: 'landing zone for raw files' },
  { id: 'b', label: 'Bronze', sub: 'raw / minimally transformed' },
  { id: 's', label: 'Silver', sub: 'cleaned / transformed' },
  { id: 'g', label: 'Gold', sub: 'analytics-ready datasets' },
  { id: 'pbi', label: 'SQL / Power BI', sub: 'analysis and dashboards' },
]
const Hero3D = lazy(() => import('../components/Hero3D'))
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')
function SectionNav({ ids }: { ids: string[] }) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-40% 0px -55% 0px' })
    ids.forEach(i => { const n = document.getElementById(i); if (n) io.observe(n) }); return () => io.disconnect()
  }, [ids])
  return (
    <nav aria-label="Case study sections" className="sticky top-16 z-40 -mx-6 mt-10 flex gap-5 overflow-x-auto border-b border-white/10 bg-bg/80 px-6 backdrop-blur">
      {ids.map(i => <a key={i} href={`#${i}`} aria-current={active === i} className={`shrink-0 border-b-2 py-3 text-sm capitalize transition-colors ${active === i ? 'border-accent text-accent' : 'border-transparent text-fg2 hover:text-fg'}`}>{i.replace(/-/g, ' ')}</a>)}
    </nav>)
}
const Empty = () => <p className="text-muted">To be added. Edit this project in <code className="font-mono">src/data/projects.ts</code>.</p>

export default function CaseStudy() {
  const { id } = useParams()
  const p = projects.find(x => x.id === id)
  if (!p) return <main className="mx-auto max-w-[800px] px-6 pt-32"><p>Project not found.</p><Link to="/" className="text-accent">Back to projects</Link></main>
  const list = (a: string[]) => a.length ? <ul className="list-disc space-y-1 pl-5 text-fg2">{a.map(x => <li key={x}>{x}</li>)}</ul> : <Empty />
  const sections: [string, React.ReactNode][] = [
    ['Business problem', p.problem ? <p className="text-fg2">{p.problem}</p> : <Empty />],
    ['Solution', p.solution ? <p className="text-fg2">{p.solution}</p> : <Empty />],
    ['Key insights', list(p.insights)], ['Challenges', list(p.challenges)],
    ['Learnings', list(p.learnings)], ['Future improvements', list(p.futureImprovements)],
  ]
  return (
    <main className="mx-auto max-w-[900px] px-6 pb-24 pt-28">
      <Link to="/#work" className="inline-flex items-center gap-1 text-sm text-fg2 hover:text-fg"><ArrowLeft size={14} /> Back to projects</Link>
      <p className="mt-6 font-mono text-xs text-cyan">{p.category}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{p.title}</h1>
      <p className="mt-4 text-fg2">{p.shortDescription}</p>
      <ul className="mt-5 flex flex-wrap gap-2">{p.technologies.map(t => <li key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs">{t}</li>)}</ul>
      <div className="mt-6 flex gap-3 text-sm font-semibold">
        <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2">GitHub <ArrowUpRight size={14} /></a>
        {p.dashboard && <a href={p.dashboard} target="_blank" rel="noreferrer" className="rounded-lg bg-gradient-to-r from-accent to-cyan px-4 py-2 text-bg">Live dashboard</a>}
      </div>
      {p.metrics.length > 0 && <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {p.metrics.map(m => <div key={m.label} className="rounded-xl border border-white/10 bg-card p-4"><dd className="text-2xl font-extrabold">{m.value}</dd><dt className="text-sm text-muted">{m.label}</dt></div>)}
      </dl>}
      <SectionNav ids={[...(p.id === 'goodcabs' ? ['architecture'] : []), ...(p.technologies.includes('Power BI') ? ['dashboard'] : []), ...sections.map(([h]) => slug(h))]} />
      {p.id === 'goodcabs' && <section id="architecture" className="mt-12 scroll-mt-32"><h2 className="mb-4 text-xl font-bold">Architecture</h2><div className="grid items-center gap-8 md:grid-cols-2"><div className="max-w-sm"><DataPipeline nodes={goodcabsArch} sources={['Raw transportation data']} /></div><Suspense fallback={null}><Hero3D /></Suspense></div></section>}
      {p.technologies.includes('Power BI') && <DashboardPreview kpis={p.metrics.length ? p.metrics.map(m => m.label) : ['KPI 1', 'KPI 2', 'KPI 3', 'KPI 4']} />}
      {sections.map(([h, body]) => <section key={h} id={slug(h)} className="mt-12 scroll-mt-32"><h2 className="mb-3 text-xl font-bold">{h}</h2>{body}</section>)}
    </main>
  )
}
