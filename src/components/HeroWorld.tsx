import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { palette, useScene, type Ctx } from '../lib/useScene'

// A 3D data pipeline you can read without text: database stack -> bucket -> Bronze/Silver/Gold layers -> live bar-chart dashboard.
export default function HeroWorld() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    const world = new THREE.Group(); world.position.set(1.0, -0.6, 0); scene.add(world)
    const themed: { m: THREE.Material & { color: THREE.Color }; i: number }[] = []
    const fill = (i: number, o: number) => { const m = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: o }); track(m); themed.push({ m, i }); return m }
    const line = (i: number) => { const m = new THREE.LineBasicMaterial({ color: '#8B7CFF' }); track(m); themed.push({ m, i }); return m }
    const solid = (g: THREE.BufferGeometry, p: [number, number, number], i: number, o = 0.18) => {
      track(g); const eg = new THREE.EdgesGeometry(g); track(eg); const grp = new THREE.Group(); grp.position.set(...p)
      grp.add(new THREE.Mesh(g, fill(i, o)), new THREE.LineSegments(eg, line(i))); world.add(grp); return grp
    }
    const metal = (g: THREE.BufferGeometry, y: number, c: string) => {
      track(g); const eg = new THREE.EdgesGeometry(g); track(eg); const f = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.22 }); const l = new THREE.LineBasicMaterial({ color: c }); track(f); track(l)
      const grp = new THREE.Group(); grp.position.set(0, y, 0); grp.add(new THREE.Mesh(g, f), new THREE.LineSegments(eg, l)); world.add(grp)
    }
    const dbs = [-0.6, 0, 0.6].map((y, k) => solid(new THREE.CylinderGeometry(0.9, 0.9, 0.42, 28), [-5, y, 0], k % 2 ? 1 : 0, 0.22))
    const bucket = solid(new THREE.CylinderGeometry(0.95, 0.68, 1.5, 24), [-2.6, 0, 0], 1, 0.2)
    ;(['#CD7F32', '#B8C2D1', '#F5C542'] as const).forEach((c, k) => metal(new THREE.BoxGeometry(2.3, 0.24, 2.3), -0.8 + k * 0.7, c))
    const panel = solid(new THREE.BoxGeometry(3.3, 2.3, 0.1), [3.5, 0.15, -0.3], 0, 0.1)
    const bars = [0, 1, 2, 3, 4].map(i => { const g = new THREE.BoxGeometry(0.42, 1, 0.3); g.translate(0, 0.5, 0); const b = solid(g, [2.5 + i * 0.6, -0.85, 0], i % 3, 0.35); return b })
    const donut = solid(new THREE.TorusGeometry(0.5, 0.14, 8, 32), [5.6, 1, 0], 2, 0.3)
    const grid = new THREE.GridHelper(18, 18, '#8B7CFF', '#8B7CFF'); grid.position.y = -1.7; const gm = grid.material as THREE.Material; gm.transparent = true; gm.opacity = 0.18; world.add(grid); track(grid.geometry); track(gm)
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-5, 0, 0.6), new THREE.Vector3(-2.6, 0.4, 0.6), new THREE.Vector3(0, 0.1, 0.6), new THREE.Vector3(2.3, 0.3, 0.6)])
    const lg = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)); const lm = new THREE.LineBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.35 }); track(lg); track(lm); world.add(new THREE.Line(lg, lm))
    const N = 70; const pos = new Float32Array(N * 3), col = new Float32Array(N * 3); const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const pm = new THREE.PointsMaterial({ size: 0.11, vertexColors: true }); track(pg); track(pm); world.add(new THREE.Points(pg, pm))
    let px = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    cam.position.set(0, 1.0, 7.4); cam.lookAt(0, 0, 0)
    const c1 = new THREE.Color(), c2 = new THREE.Color(); let t = 0; const v = new THREE.Vector3()
    return (dt: number) => {
      t += dt; const pal = palette(); themed.forEach(({ m, i }) => m.color.set(pal[i]))
      world.scale.setScalar(Math.min(1, cam.aspect * 0.5)); world.rotation.y = Math.sin(t * 0.3) * 0.2 + px * 0.35; world.rotation.x = 0.1
      dbs.forEach((d, k) => { d.position.y = (k - 1) * 0.6 + Math.sin(t * 1.5 + k) * 0.04 }); bucket.position.y = Math.sin(t * 1.2) * 0.08
      bars.forEach((b, i) => { b.scale.y = 0.5 + 1.1 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 0.9)) }); donut.rotation.x = t * 0.8; donut.rotation.y = t * 0.5; panel.position.y = 0.15 + Math.sin(t) * 0.04
      c1.set(pal[0]); c2.set(pal[2])
      for (let i = 0; i < N; i++) { const u = (t * 0.12 + i / N) % 1; curve.getPoint(u, v); pos.set([v.x, v.y + Math.sin(u * 40 + t * 3) * 0.08, v.z], i * 3); const c = c1.clone().lerp(c2, u); col.set([c.r, c.g, c.b], i * 3) }
      pg.attributes.position.needsUpdate = true; pg.attributes.color.needsUpdate = true
    }
  }, [])
  useScene(ref, build, 45, 7.4)
  return <div ref={ref} className="relative h-full w-full overflow-hidden" role="img" aria-label="3D data pipeline: database, cloud storage bucket, Bronze Silver Gold layers and a live bar-chart dashboard" />
}
