import { MapPin, Briefcase, GraduationCap, Target } from 'lucide-react'

const facts = [[MapPin, 'Location', 'Pune / Lonavala, India'], [Briefcase, 'Currently', 'Data Analyst, Autoline Industries Ltd.'], [GraduationCap, 'Education', 'B.E. Robotics & Automation Engineering (2022–2026)'], [Target, 'Focus', 'Data Analytics · Data Engineering · Data & ML']] as const
const journey = ['Robotics & Automation', 'Software', 'Data Analytics', 'Data Engineering', 'Data + ML']

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1200px] px-6 py-20" aria-labelledby="about-h">
      <p className="font-mono text-xs text-cyan">ABOUT ME</p>
      <h2 id="about-h" className="mt-2 text-3xl font-bold">From machines to data</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 text-fg2">
          <p>I'm Omkar Yelsange, a Data Analyst at Autoline Industries Ltd. based in Pune, with a B.E. in Robotics &amp; Automation Engineering. I started in engineering and gradually moved toward software and data, where I'm most interested in how raw data becomes reliable pipelines, dashboards and decisions.</p>
          <p>At Autoline I work with live sensor data collected from physical industrial grinding machines. Alongside the job I build data engineering skills with Databricks, PySpark, AWS and the Medallion architecture, and I create dashboards and analyses with SQL, Python and Power BI.</p>
          <p>I'm looking for roles across data analytics, data engineering, business intelligence and data / ML.</p>
          <ol data-stagger className="stagger flex flex-wrap gap-2 pt-2 font-mono text-xs" aria-label="Career journey">
            {journey.map((j, k) => <li key={j} className="rounded-full border border-white/15 bg-card px-3 py-1 text-fg">{j}{k < journey.length - 1 && <span className="ml-2 text-accent">→</span>}</li>)}
          </ol>
        </div>
        <ul data-stagger className="stagger grid gap-3">
          {facts.map(([Icon, l, v]) => <li key={l} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card p-4"><Icon size={18} className="mt-0.5 text-accent" /><div><p className="text-xs text-muted">{l}</p><p className="text-sm">{v}</p></div></li>)}
        </ul>
      </div>
    </section>)
}
