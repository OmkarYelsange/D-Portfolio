import { skills } from '../data/skills'
import { experience } from '../data/experience'
import { siteConfig } from '../data/siteConfig'
import { lazy, Suspense } from 'react'
import ContactForm from './ContactForm'

const Shape3D = lazy(() => import('./Scenes').then(m => ({ default: m.Shape3D })))
const S = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mx-auto max-w-[1200px] px-6 py-20"><h2 className="mb-8 text-3xl font-bold">{title}</h2>{children}</section>)

export const Skills = () => (
  <S id="skills" title="Skills & tech stack">
    <div data-stagger className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(skills).map(([g, items]) => (
        <div key={g} className="rounded-2xl border border-white/10 bg-card p-5"><h3 className="font-semibold text-accent">{g}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">{items.map(i => <li key={i} className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2">{i}</li>)}</ul></div>))}
    </div>
  </S>)

export const Experience = () => (
  <S id="experience" title="Experience">
    <ol data-stagger className="stagger space-y-5 border-l border-white/15 pl-6">
      {experience.map(e => (
        <li key={e.company + e.role} className="relative rounded-2xl border border-white/10 bg-card p-5">
          <span className={`absolute -left-[31px] top-6 h-3 w-3 rounded-full ${e.current ? 'animate-pulse bg-accent' : 'bg-muted'}`} aria-hidden />
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{e.role}</h3><span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-fg2">{e.type}</span>{e.current && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">Current</span>}</div>
          <p className="text-fg2">{e.company}</p>
          <p className="text-sm text-muted">{e.dates || 'Dates to be added'}</p>
          {e.points.length > 0 ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fg2">{e.points.map(p => <li key={p}>{p}</li>)}</ul> : <p className="mt-3 text-sm text-muted">Details to be added.</p>}
          {e.tech.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{e.tech.map(t => <li key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2">{t}</li>)}</ul>}
        </li>))}
    </ol>
  </S>)

export const Contact = () => (
  <S id="contact" title="Let's connect">
    <p className="max-w-[60ch] text-fg2">Have an opportunity, project, or collaboration involving data? I'd love to hear from you.</p>
    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
      <a className="rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 text-bg" href={`mailto:${siteConfig.email}`}>Email me</a>
      <a className="rounded-lg border border-white/15 px-5 py-3" href={siteConfig.social.github} target="_blank" rel="noreferrer">GitHub</a>
      {siteConfig.social.linkedin && <a className="rounded-lg border border-white/15 px-5 py-3" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
    </div>
    <div className="grid items-center gap-8 lg:grid-cols-2"><ContactForm /><Suspense fallback={<div className="h-56" />}><Shape3D kind="torus" /></Suspense></div>
  </S>)

export const Footer = () => (
  <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-muted">
    <p className="text-fg">{siteConfig.name}</p><p>{siteConfig.location} · © 2026 · Built with React + Vite + Tailwind</p></footer>)
