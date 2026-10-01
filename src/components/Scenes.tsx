import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { accent, palette, useScene, type Ctx } from '../lib/useScene'

// Site-wide backdrop: faint wireframe solids that drift while the page scrolls.
export function Background3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TorusGeometry(0.8, 0.25, 8, 16)]
    const items: { m: THREE.LineSegments; s: number }[] = []
    for (let i = 0; i < 16; i++) {
      const eg = new THREE.EdgesGeometry(geos[i % 3]); const mat = new THREE.LineBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: 0.3 })
      const m = new THREE.LineSegments(eg, mat); m.scale.setScalar(0.5 + Math.random() * 0.9)
      m.position.set((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 26, -Math.random() * 6); scene.add(m); track(eg); track(mat); items.push({ m, s: 0.1 + Math.random() * 0.25 })
    }
    geos.forEach(g => track(g))
    return (dt: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); cam.position.y += ((11 - (scrollY / max) * 22) - cam.position.y) * 0.08
      const pal = palette(); items.forEach(({ m, s }, i) => { m.rotation.x += dt * s; m.rotation.y += dt * s * 1.3; (m.material as THREE.LineBasicMaterial).color.set(pal[i % 3]) })
    }
  }, [])
  useScene(ref, build, 50, 14)
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 opacity-70" aria-hidden />
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
    return (dt: number) => { m.rotation.y += dt * 0.4; m.rotation.x += (py - m.rotation.x % 0.001) * 0; m.position.x += (px - m.position.x) * 0.05; m.position.y += (-py - m.position.y) * 0.05; core.rotation.y -= dt * 0.8; mat.color.set(accent()); im.color.set(palette()[1]) }
  }, [kind])
  useScene(ref, build, 40, 6)
  return <div ref={ref} className="relative h-56 w-full min-w-0 overflow-hidden sm:h-72" role="img" aria-label="Decorative rotating 3D wireframe" />
}
