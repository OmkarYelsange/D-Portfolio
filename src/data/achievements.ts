export type CertKind = 'Certificate' | 'Award' | 'Publication'
export interface Cert { title: string; issuer: string; date: string; sort: string; kind: CertKind; note?: string }
// Listed latest to oldest (sorted by `sort`).
export const certifications: Cert[] = ([
  { title: 'Deloitte Data Analytics Job Simulation', issuer: 'Deloitte (job simulation)', date: 'March 2026', sort: '2026-03', kind: 'Certificate' },
  { title: 'Paper Presentation Certificate', issuer: 'D Y Patil College of Engineering, Pune', date: 'May 2025', sort: '2025-05', kind: 'Publication', note: 'Presented the paper "Sensor-based Monitoring of Grinding Wheel Efficiency in Surface Grinding Operation".' },
  { title: 'DIPEX State Level Competition: Finalist', issuer: 'DIPEX', date: 'April 2025', sort: '2025-04', kind: 'Award' },
  { title: 'First Consolation Prize, Utkarsh 2K25', issuer: 'National Project Level Competition', date: 'March 2025', sort: '2025-03', kind: 'Award' },
  { title: 'Python 101 for Data Science', issuer: 'IBM Cognitive Class', date: 'Jan 2025', sort: '2025-01', kind: 'Certificate' },
  { title: 'Prompt Engineering for Everyone', issuer: 'IBM Cognitive Class', date: 'Nov 2024', sort: '2024-11', kind: 'Certificate' },
] as Cert[]).sort((a, b) => b.sort.localeCompare(a.sort))

export interface Activity { title: string; detail: string }
export const cocurricular: Activity[] = [
  { title: 'SARA Club', detail: 'Active team member in college, 2024 to 2025.' },
  { title: 'Tech Fest', detail: 'Participated actively.' },
  { title: 'Runner-up, Utkarsh 2K25', detail: 'National Project Level Competition, March 2025.' },
  { title: 'Finalist, DIPEX', detail: 'State Level Competition, April 2025.' },
  { title: 'Final Year Project', detail: 'Active team lead and member.' },
  { title: 'Research Paper', detail: 'Published.' },
]
