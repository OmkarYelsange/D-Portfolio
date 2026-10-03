import kb from '../data/knowledge.json'

export interface Msg { role: 'user' | 'assistant'; text: string }
export interface QA { group: string; q: string; keywords: string; a: string; pop?: boolean }
export const predefined = kb.qa as QA[]
export const groups = [...new Set(predefined.map(x => x.group))]

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const stop = new Set('you your the and what are how can does did about tell with know for have has this that who which any please me my is it do was were will would could should there their from into on in of to a an at be been being'.split(' '))
const syn: Record<string, string> = { cv: 'resume', job: 'role', jobs: 'role', employer: 'company', college: 'education', university: 'education', studies: 'education', study: 'education', marks: 'percentage', percent: 'percentage', score: 'percentage', tools: 'skills', tech: 'skills', stack: 'skills', technologies: 'skills', repo: 'github', repos: 'github', repository: 'github', ctc: 'salary', pay: 'salary', hire: 'contact', reach: 'contact', mail: 'email', number: 'phone', projects: 'project', internships: 'internship', certifications: 'certification', certificates: 'certification', awards: 'achievements', award: 'achievements', experience: 'experience', worked: 'experience', location: 'based', live: 'based', city: 'based', robotics: 'robotics', pyspark: 'databricks', spark: 'databricks', glue: 'aws', athena: 'aws', s3: 'aws', quicksight: 'aws', tableau: 'powerbi', power: 'powerbi' }
const toks = (s: string) => norm(s).split(' ').filter(w => w.length > 1 && !stop.has(w)).map(w => syn[w] ?? w)

const index = predefined.map(x => ({ x, k: new Set(toks(x.keywords)), q: new Set(toks(x.q)), a: new Set(toks(x.a)) }))
const lines = (kb.profile as string[]).flatMap(l => l.split(/(?<=\.)\s+/)).map(t => ({ t, k: new Set(toks(t)) }))

export function matchPredefined(q: string) { return predefined.find(x => norm(x.q) === norm(q))?.a }

// Offline "custom question" answering: weighted keyword retrieval over the Q&A, then over the raw profile sentences.
export function localAnswer(q: string): string {
  const n = norm(q)
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/.test(n)) return "Hi! I'm Omkar's assistant. Ask me about his experience, projects, skills, education or how to contact him."
  if (/\b(thanks|thank you|thx)\b/.test(n)) return "You're welcome! Anything else you'd like to know about Omkar?"
  const t = [...new Set(toks(q))]
  let best = { s: 0, a: '' }
  for (const e of index) { let s = 0; for (const w of t) { if (e.k.has(w)) s += 3; if (e.q.has(w)) s += 2; if (e.a.has(w)) s += 1 } if (s > best.s) best = { s, a: e.x.a } }
  if (best.s >= 4) return best.a
  const ranked = lines.map(l => ({ l, s: t.filter(w => l.k.has(w)).length })).filter(r => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 2)
  if (ranked.length) return ranked.map(r => r.l.t).join(' ')
  return "I don't have that information yet. You can ask about Omkar's experience, projects, skills or education, or email omkaryelsange1010@gmail.com."
}

// Predefined questions answer instantly. Everything else goes to the Gemini-backed /api/chat, with the offline matcher as fallback.
export async function askAssistant(history: Msg[]): Promise<string> {
  const last = history[history.length - 1].text
  const canned = matchPredefined(last); if (canned) return canned
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) })
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) { const d = await r.json(); if (d.reply) return d.reply }
  } catch { /* fall through */ }
  return localAnswer(last)
}
