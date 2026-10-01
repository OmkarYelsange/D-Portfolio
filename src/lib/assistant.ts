import kb from '../data/knowledge.json'

export interface Msg { role: 'user' | 'assistant'; text: string }
export const predefined = kb.qa
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

export function matchPredefined(q: string) { return kb.qa.find(x => norm(x.q) === norm(q))?.a }

// Offline fallback: score the question against each entry's keywords.
export function localAnswer(q: string): string {
  const stop = new Set('you your the and what are how can does did about tell with know for have has this that who which any'.split(' '))
  const words = new Set(norm(q).split(' ').filter(w => w.length > 2 && !stop.has(w)))
  let best = { s: 0, a: '' }
  for (const x of kb.qa) { const s = norm(`${x.q} ${x.keywords}`).split(' ').filter(w => words.has(w)).length; if (s > best.s) best = { s, a: x.a } }
  return best.s > 0 ? best.a : "I don't have that information yet. Try one of the suggested questions, or email omkaryelsange1010@gmail.com."
}

// Predefined questions answer instantly; everything else goes to the Gemini-backed /api/chat, with the offline matcher as fallback.
export async function askAssistant(history: Msg[]): Promise<string> {
  const last = history[history.length - 1].text
  const canned = matchPredefined(last); if (canned) return canned
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) })
    if (r.ok) { const d = await r.json(); if (d.reply) return d.reply }
  } catch { /* fall through */ }
  return localAnswer(last)
}
