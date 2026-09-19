import { useEffect, useRef, useState } from 'react';

export function ThreeHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const mount = mountRef.current;
    // Probe a throwaway canvas first so unsupported browsers fall back before
    // Three.js tries to create a renderer and reports a noisy context error.
    const canUseWebGL = (() => {
      if (!window.WebGLRenderingContext) return false;
      try {
        const probe = document.createElement('canvas');
        return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    if (!mount || !canUseWebGL) { setFailed(true); return; }
    let cancelled = false;
    let cleanupScene: (() => void) | undefined;

    // Load Three.js only for this hero so the rest of the site can paint before
    // the 3D module arrives. This keeps the initial route responsive on mobile.
    void import('three').then((THREE) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); return; }
      // Scene: a quiet field of warm geometry, representing people connected by good systems.
      const scene = new THREE.Scene();
      // Camera: a wide perspective keeps the sculpture airy and editorial.
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0.15, 6.8);
      // Renderer: transparent canvas lets the paper-toned hero remain visible underneath.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      // Geometry/material: a cool wireframe icosahedron with orbiting nodes keeps
      // the sculpture distinct from the coral headline accent.
      const group = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.38, 2),
        new THREE.MeshStandardMaterial({
          color: 0x18314b,
          roughness: 0.5,
          metalness: 0.08,
          wireframe: true,
          transparent: true,
          opacity: 0.72,
        }),
      );
      group.add(core);
      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(0.95, 24, 16),
        new THREE.MeshStandardMaterial({
          color: 0x5f8d8a,
          roughness: 0.72,
          metalness: 0.04,
          transparent: true,
          opacity: 0.28,
        }),
      );
      group.add(inner);
      const nodeGeometry = new THREE.IcosahedronGeometry(0.12, 1);
      const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x9dbfbe, roughness: 0.35 });
      for (let i = 0; i < 9; i += 1) { const node = new THREE.Mesh(nodeGeometry, nodeMaterial); const a = (i / 9) * Math.PI * 2; node.position.set(Math.cos(a) * 2.05, Math.sin(a * 1.7) * .75, Math.sin(a) * 1.3); group.add(node); }
      scene.add(group);
      // Lighting: large soft key plus a cooler fill makes the object feel tactile, not glossy.
      scene.add(new THREE.HemisphereLight(0xfff0d1, 0x18314b, 2.1));
      const key = new THREE.DirectionalLight(0xffc6a4, 2.5); key.position.set(3, 4, 5); scene.add(key);
      const resize = () => { const width = mount.clientWidth; const height = mount.clientHeight; camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
      resize(); window.addEventListener('resize', resize);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Animation loop: a slow orbit, vertical float, and breathing inner core
      // replace the old single-axis spin; reduced-motion users see a still composition.
      let frame = 0; let frameId = 0; const animate = () => { if (!reduce) { group.rotation.y += .0015; group.rotation.z = Math.sin(frame * .0025) * .06; group.position.y = Math.sin(frame * .006) * .12; inner.scale.setScalar(1 + Math.sin(frame * .01) * .035); } frame += 1; renderer.render(scene, camera); frameId = requestAnimationFrame(animate); }; frameId = requestAnimationFrame(animate);
      setReady(true);
      cleanupScene = () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', resize); renderer.dispose(); core.geometry.dispose(); core.material.dispose(); inner.geometry.dispose(); inner.material.dispose(); nodeGeometry.dispose(); nodeMaterial.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
    }).catch(() => { if (!cancelled) setFailed(true); });

    return () => { cancelled = true; cleanupScene?.(); };
  }, []);
  return <div ref={mountRef} data-testid="three-hero" aria-label="Abstract connected people sculpture" className="absolute inset-0 min-h-[390px]">{(failed || !ready) && <div className="absolute inset-0 grid place-items-center"><div className="h-64 w-64 rounded-full border-[20px] border-primary/55 [border-right-color:transparent] border-t-secondary/80" /></div>}</div>;
}