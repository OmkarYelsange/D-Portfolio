import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { accent, palette, useScene, type Ctx } from '../lib/useScene'

// Site-wide backdrop: a deep field of data-themed solids (databases, bar towers, cubes, rings, knots) plus drifting particles.
// The camera travels down with the page scroll and the whole field leans toward the pointer.
export function Background3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    const mobile = innerWidth < 768; const N = mobile ? 16 : 34
    const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TorusGeometry(0.8, 0.25, 8, 18), new THREE.TorusKnotGeometry(0.6, 0.18, 56, 6), new THREE.BoxGeometry(1.3, 1.3, 1.3), new THREE.CylinderGeometry(0.8, 0.8, 0.5, 18), new THREE.DodecahedronGeometry(1, 0)]
    geos.forEach(g => track(g))
    const world = new THREE.Group(); scene.add(world)
    const items: { o: THREE.Object3D; s: number; i: number; mats: (THREE.LineBasicMaterial | THREE.MeshBasicMaterial)[] }[] = []
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const place = (o: THREE.Object3D) => { o.position.set(rnd(-15, 15), rnd(-17, 17), rnd(-14, 1)); world.add(o) }
    for (let k = 0; k < N; k++) {
      const g = geos[k % geos.length]; const eg = new THREE.EdgesGeometry(g); track(eg)
      const lm = new THREE.LineBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: rnd(0.3, 0.55) }); track(lm)
      const grp = new THREE.Group(); grp.add(new THREE.LineSegments(eg, lm)); const mats: (THREE.LineBasicMaterial | THREE.MeshBasicMaterial)[] = [lm]
      if (k % 3 === 0) { const fm = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: 0.07 }); track(fm); grp.add(new THREE.Mesh(g, fm)); mats.push(fm) }
      grp.scale.setScalar(rnd(0.5, 1.3)); place(grp); items.push({ o: grp, s: rnd(0.08, 0.3), i: k % 3, mats })
    }
    // mini 3D bar-chart towers
    const bg = new THREE.BoxGeometry(0.34, 1, 0.34); bg.translate(0, 0.5, 0); track(bg); const beg = new THREE.EdgesGeometry(bg); track(beg)
    for (let t = 0; t < (mobile ? 2 : 5); t++) {
      const grp = new THREE.Group(); const mats: THREE.LineBasicMaterial[] = []
      for (let b = 0; b < 5; b++) { const lm = new THREE.LineBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.5 }); track(lm); mats.push(lm); const m = new THREE.LineSegments(beg, lm); m.position.x = (b - 2) * 0.5; m.scale.y = rnd(0.5, 2.6); grp.add(m) }
      grp.scale.setScalar(rnd(0.8, 1.4)); place(grp); items.push({ o: grp, s: rnd(0.05, 0.12), i: 1, mats })
    }
    // particle field
    const P = mobile ? 140 : 360; const pos = new Float32Array(P * 3)
    for (let k = 0; k < P; k++) { pos[k * 3] = rnd(-18, 18); pos[k * 3 + 1] = rnd(-20, 20); pos[k * 3 + 2] = rnd(-16, 3) }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pm = new THREE.PointsMaterial({ color: '#38BDF8', size: 0.07, transparent: true, opacity: 0.7 }); track(pg); track(pm)
    const pts = new THREE.Points(pg, pm); world.add(pts)
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    return (dt: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); const f = scrollY / max
      cam.position.y += ((12 - f * 24) - cam.position.y) * 0.08; world.rotation.y += ((px * 0.35) - world.rotation.y) * 0.04; world.rotation.x += ((py * 0.18) - world.rotation.x) * 0.04
      const pal = palette(); pm.color.set(pal[1]); pts.rotation.y += dt * 0.01
      items.forEach(({ o, s, i, mats }) => { o.rotation.x += dt * s; o.rotation.y += dt * s * 1.3; mats.forEach(m => m.color.set(pal[i])) })
    }
  }, [])
  useScene(ref, build, 50, 14)
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 opacity-80" aria-hidden />
}

// Rotating "data globe": wireframe sphere with glowing nodes, tilted orbit rings and orbiting satellites.
export function Globe3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, track }: Ctx) => {
    const g = new THREE.IcosahedronGeometry(1.5, 2); const wm = new THREE.MeshBasicMaterial({ color: '#8B7CFF', wireframe: true, transparent: true, opacity: 0.35 }); track(g); track(wm)
    const globe = new THREE.Group(); globe.add(new THREE.Mesh(g, wm)); scene.add(globe)
    const nm = new THREE.PointsMaterial({ color: '#38BDF8', size: 0.09 }); track(nm); globe.add(new THREE.Points(g, nm))
    const core = new THREE.IcosahedronGeometry(0.55, 1); const cm = new THREE.MeshBasicMaterial({ color: '#F472B6', wireframe: true }); track(core); track(cm); globe.add(new THREE.Mesh(core, cm))
    const rings: THREE.Mesh[] = []; const rm = new THREE.MeshBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.6 }); track(rm)
    const sats: { m: THREE.Mesh; r: number; sp: number; ph: number; ring: THREE.Mesh }[] = []
    const sg = new THREE.SphereGeometry(0.09, 12, 12); const sm = new THREE.MeshBasicMaterial({ color: '#F472B6' }); track(sg); track(sm)
    ;[[1.4, 0.3], [0.2, 1.0], [-0.9, 0.6]].forEach(([rx, rz], k) => {
      const tg = new THREE.TorusGeometry(2.1 + k * 0.18, 0.008, 6, 120); track(tg); const ring = new THREE.Mesh(tg, rm); ring.rotation.set(rx, 0, rz); scene.add(ring); rings.push(ring)
      const s = new THREE.Mesh(sg, sm); ring.add(s); sats.push({ m: s, r: 2.1 + k * 0.18, sp: 0.6 + k * 0.3, ph: k * 2, ring })
    })
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    let t = 0
    return (dt: number) => {
      t += dt; const pal = palette(); wm.color.set(pal[0]); nm.color.set(pal[1]); cm.color.set(pal[2]); rm.color.set(pal[1]); sm.color.set(pal[2])
      globe.rotation.y += dt * 0.25; globe.rotation.x += (py * 0.6 - globe.rotation.x) * 0.04; scene.rotation.y += (px * 0.6 - scene.rotation.y) * 0.04
      sats.forEach(s => s.m.position.set(Math.cos(t * s.sp + s.ph) * s.r, Math.sin(t * s.sp + s.ph) * s.r, 0))
    }
  }, [])
  useScene(ref, build, 40, 7)
  return <div ref={ref} className="relative h-full w-full" role="img" aria-label="Decorative rotating 3D data globe" />
}

// Small rotating wireframe that leans toward the pointer.
export function Shape3D({ kind = 'ico' }: { kind?: 'ico' | 'torus' }) {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, track }: Ctx) => {
    const g = kind === 'torus' ? new THREE.TorusKnotGeometry(1, 0.3, 90, 10) : new THREE.IcosahedronGeometry(1.5, 1)
    const mat = new THREE.MeshBasicMaterial({ color: '#8B7CFF', wireframe: true, transparent: true, opacity: 0.8 })
    const m = new THREE.Mesh(g, mat); scene.add(m); track(g); track(mat)
    const inner = new THREE.IcosahedronGeometry(0.6, 0); const im = new THREE.MeshBasicMaterial({ color: '#38BDF8', wireframe: true }); const core = new THREE.Mesh(inner, im)
    if (kind === 'ico') { scene.add(core) } track(inner); track(im)
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = (e.clientX / innerWidth - 0.5) * 1.2; py = (e.clientY / innerHeight - 0.5) * 1.2 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    return (dt: number) => { m.rotation.y += dt * 0.4; m.position.x += (px - m.position.x) * 0.05; m.position.y += (-py - m.position.y) * 0.05; core.rotation.y -= dt * 0.8; mat.color.set(accent()); im.color.set(palette()[1]) }
  }, [kind])
  useScene(ref, build, 40, 6)
  return <div ref={ref} className="relative h-56 w-full min-w-0 overflow-hidden sm:h-72" role="img" aria-label="Decorative rotating 3D wireframe" />
}
