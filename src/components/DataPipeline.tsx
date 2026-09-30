import { motion, useReducedMotion } from 'framer-motion'

export interface PipelineNodeData { id: string; label: string; sub?: string }
export const heroPipeline: PipelineNodeData[] = [
  { id: 's3', label: 'AWS S3', sub: 'raw files' },
  { id: 'dbx', label: 'Databricks', sub: 'bronze → silver → gold' },
  { id: 'sql', label: 'SQL / PySpark', sub: 'transform' },
  { id: 'pbi', label: 'Power BI', sub: 'dashboards' },
]

export default function DataPipeline({ nodes = heroPipeline, sources = ['APIs', 'CSV', 'Databases'] }: { nodes?: PipelineNodeData[]; sources?: string[] }) {
  const reduce = useReducedMotion()
  const all = [{ id: 'raw', label: 'Raw Data', sub: sources.join(' · ') }, ...nodes]
  return (
    <ol className="flex flex-col font-mono text-sm" aria-label="Data pipeline">
      {all.map((n, i) => (
        <li key={n.id}>
          <motion.div initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.5 }}
            className="rounded-xl border border-white/10 bg-card px-4 py-3 transition-colors hover:border-accent/50">
            <div className="text-fg">{n.label}</div>
            {n.sub && <div className="text-xs text-muted">{n.sub}</div>}
          </motion.div>
          {i < all.length - 1 && (
            <div className="relative ml-8 h-8 w-px bg-white/15" aria-hidden>
              {!reduce && <motion.span className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                animate={{ top: ['0%', '100%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.3 }} />}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
