import { lazy, Suspense, useEffect, useState } from 'react'
import { Star, GitFork } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'
import { Heatmap } from './Extras'

const S = ({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: React.ReactNode }) => (
  <section id={id} className="mx-auto max-w-[1200px] px-6 py-20"><h2 className="text-3xl font-bold">{title}</h2>
    {sub && <p className="mt-2 text-fg2">{sub}</p>}<div className="mt-8">{children}</div></section>)

const steps = [['Understand', 'What problem are we solving?'], ['Collect', 'Where does the data come from?'], ['Clean', 'Can we trust the data?'],
  ['Transform', 'How should the data be modeled?'], ['Analyze', 'What does the data tell us?'], ['Visualize', 'How can we communicate it?'], ['Decide', 'What action should the business take?']]
export const Process = () => (
  <S title="How I work with data">
    <ol data-stagger className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(([t, q], i) => <li key={t} className="rounded-2xl border border-white/10 bg-card p-5"><span className="font-mono text-xs text-cyan">Step {i + 1}</span>
        <h3 className="mt-1 font-semibold">{t}</h3><p className="text-sm text-fg2">{q}</p></li>)}
    </ol>
  </S>)

const build = [['Data analytics', 'Turning data into insights and decisions.'], ['Data engineering', 'Building reliable data pipelines and analytics-ready datasets.'], ['Data / ML', 'Exploring intelligent systems using machine learning and generative AI.']]
export const WhatIBuild = () => (
  <S title="What I build"><div data-stagger className="stagger grid gap-5 md:grid-cols-3">
    {build.map(([t, d]) => <div key={t} className="rounded-2xl border border-white/10 bg-card p-6"><h3 className="font-semibold text-accent">{t}</h3><p className="mt-2 text-fg2">{d}</p></div>)}</div></S>)

export const Education = () => (
  <S title="Education"><div className="max-w-md rounded-2xl border border-white/10 bg-card p-6">
    <h3 className="font-semibold">B.E. Robotics &amp; Automation Engineering</h3>
    <p className="text-fg2">D Y Patil College of Engineering, Akurdi, Pune</p><p className="text-sm text-muted">2022–2026</p></div></S>)

interface Repo { id: number; name: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; pushed_at: string; html_url: string }
export function GitHub() {
  const [repos, setRepos] = useState<Repo[]>([]); const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  useEffect(() => {
    fetch('https://api.github.com/users/OmkarYelsange/repos?sort=pushed&per_page=6').then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Repo[]) => { setRepos(d); setState('ok') }).catch(() => setState('error'))
  }, [])
  return (
    <S title="GitHub" sub="Code is where the implementation lives.">
      {state === 'loading' && <p className="text-fg2" role="status">Loading repositories…</p>}
      {state === 'error' && <p className="text-fg2">Couldn't load repositories right now. Browse them on <a className="text-accent underline" href={siteConfig.social.github}>GitHub</a>.</p>}
      <div data-stagger className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map(r => <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-card p-5 transition hover:border-accent/50">
          <h3 className="font-mono text-sm font-semibold">{r.name}</h3><p className="mt-2 text-sm text-fg2">{r.description ?? 'No description.'}</p>
          <p className="mt-4 flex gap-4 text-xs text-muted"><span>{r.language ?? '—'}</span><span className="flex items-center gap-1"><Star size={12} />{r.stargazers_count}</span>
            <span className="flex items-center gap-1"><GitFork size={12} />{r.forks_count}</span><span>Updated {new Date(r.pushed_at).toLocaleDateString()}</span></p></a>)}
      </div>
      <Heatmap />
    </S>)
}

export const posts: { title: string; url: string }[] = [] // TODO: add real articles (title + url)
export const Blog = () => (
  <S title="From my notebook" sub="Technical articles, experiments and lessons from working with data.">
    {posts.length === 0 ? <p className="text-muted">Articles are coming soon.</p> :
      <ul className="grid gap-4 sm:grid-cols-2">{posts.map(p => <li key={p.url}><a className="block rounded-2xl border border-white/10 bg-card p-5" href={p.url}>{p.title}</a></li>)}</ul>}
  </S>)

const Shape3D = lazy(() => import('./Scenes').then(m => ({ default: m.Shape3D })))
export const ResumeCTA = () => (
  <S title="Ready to work with data?" sub="Explore my resume to learn more about my experience, projects and technical background.">
    <div className="grid items-center gap-6 md:grid-cols-2">
      <div className="flex gap-3 text-sm font-semibold">
        <a className="rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 text-bg transition hover:brightness-110" href={siteConfig.resume} target="_blank" rel="noreferrer">View resume</a>
        <a className="rounded-lg border border-white/15 px-5 py-3" href={siteConfig.resume} download>Download resume</a></div>
      <Suspense fallback={<div className="h-56" />}><Shape3D kind="ico" /></Suspense>
    </div></S>)
