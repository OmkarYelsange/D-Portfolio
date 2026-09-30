import { useState } from 'react'
type St = 'idle' | 'sending' | 'ok' | 'error'
const env = import.meta.env
export default function ContactForm() {
  const [st, setSt] = useState<St>('idle'); const [msg, setMsg] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    if (!env.VITE_EMAILJS_SERVICE_ID || !env.VITE_EMAILJS_TEMPLATE_ID || !env.VITE_EMAILJS_PUBLIC_KEY) { setSt('error'); setMsg('The form is not configured yet. Please email me directly.'); return }
    setSt('sending')
    try {
      const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: env.VITE_EMAILJS_SERVICE_ID, template_id: env.VITE_EMAILJS_TEMPLATE_ID, user_id: env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: { name: f.get('name'), email: f.get('email'), message: f.get('message') } }) })
      if (!r.ok) throw new Error(); setSt('ok'); e.currentTarget.reset()
    } catch { setSt('error'); setMsg('Message could not be sent. Please try again or email me directly.') }
  }
  const cls = 'mt-1 w-full rounded-lg border border-white/10 bg-bg2 px-3 py-2 outline-none focus:border-accent'
  return (
    <form onSubmit={submit} className="mt-8 max-w-lg space-y-4">
      <label className="block text-sm">Name<input name="name" required className={cls} /></label>
      <label className="block text-sm">Email<input name="email" type="email" required className={cls} /></label>
      <label className="block text-sm">Message<textarea name="message" required rows={4} className={cls} /></label>
      <button disabled={st === 'sending'} className="rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 font-semibold text-bg disabled:opacity-60">{st === 'sending' ? 'Sending…' : 'Send message'}</button>
      <p role="status" className="text-sm">{st === 'ok' && 'Thanks, your message was sent.'}{st === 'error' && <span className="text-red-400">{msg}</span>}</p>
    </form>)
}
