// Reusable SVG chart primitives. Every chart takes data props; the case-study preview feeds them illustrative shapes only.
const W = 120, H = 60
export const KPIStat = ({ label, value = '—' }: { label: string; value?: string }) => (
  <div className="rounded-lg bg-white/5 p-3"><p className="text-xs text-muted">{label}</p><p className="text-xl font-bold text-fg2">{value}</p></div>)

export function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data), bw = W / data.length
  return <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="presentation">{data.map((d, i) => <rect key={i} x={i * bw + 3} y={H - (d / max) * H} width={bw - 6} height={(d / max) * H} rx="2" className="fill-cyan/50 origin-bottom [animation:grow_.8s_ease_both]" style={{ animationDelay: `${i * 70}ms` }} />)}</svg>
}
export function MiniLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data), pts = data.map((d, i) => `${(i / (data.length - 1)) * W},${H - (d / max) * (H - 6) - 3}`).join(' ')
  return <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="presentation"><polyline points={pts} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-accent [stroke-dasharray:400] [animation:draw_1.6s_ease_both]" /></svg>
}
export function DonutChart({ data }: { data: number[] }) {
  const total = data.reduce((a, b) => a + b, 0), r = 22, c = 2 * Math.PI * r; let off = 0
  const cols = ['stroke-accent', 'stroke-cyan', 'stroke-pink']
  return <svg viewBox="0 0 60 60" className="mx-auto h-[60px]" role="presentation"><g transform="rotate(-90 30 30)">{data.map((d, i) => { const len = (d / total) * c; const el = <circle key={i} cx="30" cy="30" r={r} fill="none" strokeWidth="9" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} className={cols[i % 3]} />; off += len; return el })}</g></svg>
}
