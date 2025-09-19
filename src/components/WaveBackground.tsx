import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NigerianWavesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!container || !canvas) return;

    // Fallback helper
    const mountFallback = () => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.inset = '0';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.zIndex = '0';
      wrapper.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#008753'/><stop offset='33.333%' stop-color='#008753'/><stop offset='33.333%' stop-color='#ffffff'/><stop offset='66.666%' stop-color='#ffffff'/><stop offset='66.666%' stop-color='#008753'/><stop offset='100%' stop-color='#008753'/></linearGradient><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.007 0.02' numOctaves='2' seed='3'/><feDisplacementMap in='SourceGraphic' scale='8' xChannelSelector='R' yChannelSelector='G'/></filter></defs><rect width='300' height='200' fill='url(#g)' filter='url(#w)'><animate attributeName='x' values='0;5;0' dur='4s' repeatCount='indefinite' calcMode='spline' keySplines='.42 0 .58 1'/></rect></svg>";
      container.appendChild(wrapper);
      canvas.style.display = 'none';
      return () => { try { container.removeChild(wrapper); } catch {} };
    };

    // Renderer (may throw on unsupported)
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      // Mount fallback and exit effect
      return mountFallback();
    }
    // Context check
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || (canvas as any).getContext?.('experimental-webgl');
    if (!gl) {
      return mountFallback();
    }
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.35, 3.1);
    camera.lookAt(0, 0, 0);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, new THREE.Color('#7ba17f'), 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(2.2, 2.0, 1.6);
    const amb = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(hemi, dir, amb);

    // Geometry & Material (scaled down from original 40%, then +15% larger)
    const scale = 0.69; // 0.6 * 1.15
    const width = 3 * scale, height = 2 * scale, segX = 128, segY = 96;
    const geo = new THREE.PlaneGeometry(width, height, segX, segY);
    const basePositions = geo.attributes.position.array.slice() as Float32Array;

    // 20% greener: original #008753 -> increase green channel ~20% to #00A253
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' viewBox='0 0 3 2'><rect width='3' height='2' fill='#00A253'/><rect x='1' width='1' height='2' fill='#ffffff'/></svg>";
    const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    const texLoader = new THREE.TextureLoader();
    const tex = texLoader.load(dataUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      color: new THREE.Color('#ffffff'),
      metalness: 0.0,
      roughness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4, // 60% less opaque (more transparent)
    });

    const flag = new THREE.Mesh(geo, mat);
    scene.add(flag);

    // Animation state
    const clock = new THREE.Clock();
    let running = true;
    const isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const u = { time: 0, amp: 0.12, freqX: 2.1, freqY: 1.2, speed: 1.0, edge: 0.34, skew: 0.18 };
    let speedScale = 1.0;
    let speedBoost = 0.0; // wheel-based temporary speed boost
    let ampBoost = 0.0;   // click-based temporary amplitude boost
    let targetRotX = 0, targetRotY = 0; // pointer parallax targets

    // Helpers
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp((x - e0) / (e1 - e0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    // Resize & dynamic quality
    const pixelBudget = 1_000_000; // ~1MP
    const setSize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, Math.sqrt(pixelBudget / (w * h)) || 1);
      renderer.setPixelRatio(clamp(ratio, 0.7, window.devicePixelRatio || 1));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();

    // Pointer parallax
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // amount: [0.06 yaw, 0.04 pitch]
      targetRotY = nx * 0.06;
      targetRotX = -ny * 0.04;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Scroll speed sync: map 0..1 -> 0.9..1.15
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / max, 0, 1);
      speedScale = 0.9 + p * 0.25;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Wheel interaction: quick speed pulses based on wheel delta
    const onWheel = (e: WheelEvent) => {
      const delta = clamp(e.deltaY / 800, -0.25, 0.25);
      speedBoost = clamp(speedBoost + delta, -0.5, 0.5);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    // Click interaction: momentary gust bump to amplitude
    const onClick = () => {
      ampBoost = clamp(ampBoost + 0.1, 0, 0.25);
    };
    window.addEventListener('click', onClick, { passive: true as any });

    // Visibility pause
    const onVis = () => {
      const nowVisible = !document.hidden;
      running = nowVisible;
      if (nowVisible) {
        clock.getDelta();
        requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // Camera subtle parallax
    const camBase = new THREE.Vector3(0, 0.35, 3.1);

    // Main loop
    const animate = () => {
      if (!running) { return; }
      const dt = clock.getDelta() * u.speed * Math.max(0.1, speedScale + speedBoost);
      u.time += dt;

      // Timelines (yoyo)
      const tAmp = (u.time / 2.2) % 2; // 0..2
      const k = tAmp < 1 ? tAmp : 2 - tAmp; // 0..1..0
      const inOutSine = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
      const yo = inOutSine(k);
      const amp = 0.08 + yo * (0.14 - 0.08);
      const waveSpeed = 0.9 + yo * (1.2 - 0.9);
      const ampEffective = amp + ampBoost;

      // Flag base rotation yoyo (4.4s)
      const tRot = (u.time / 4.4) % 2;
      const kRot = tRot < 1 ? tRot : 2 - tRot;
      const yoRot = inOutSine(kRot);
      const baseRotX = 0.02 + ( -0.02 - 0.02) * yoRot; // 0.02 -> -0.02
      const baseRotY = -0.18 + ( 0.18 - (-0.18)) * yoRot; // -0.18 -> 0.18

      // Camera subtle parallax (12s sine)
      const tCam = u.time / 12.0;
      camera.position.set(camBase.x + Math.sin(tCam * Math.PI * 2) * 0.06, camBase.y, camBase.z + Math.cos(tCam * Math.PI * 2) * 0.04);

      // Vertex deformation (skip if reduced motion)
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const base = basePositions as unknown as number[];
      const hw = width * 0.5;
      if (!isReduced) {
        for (let i = 0; i < arr.length; i += 3) {
          const x = base[i];
          const y = base[i + 1];
          const nx = Math.abs(x / hw);
          const edgeFall = 1 - smoothstep(1 - u.edge, 1, nx);
          let z = base[i + 2];
          z += Math.sin((x * u.freqX + u.time * waveSpeed) + y * u.skew) * ampEffective * edgeFall;
          z += 0.4 * Math.sin((y * u.freqY + u.time * 0.7)) * (ampEffective * 0.5);
          arr[i + 2] = z;
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      }

      // decay interactive boosts
      speedBoost *= 0.92;
      ampBoost *= 0.92;

      // Apply rotations with pointer parallax lerp
      flag.rotation.x += (baseRotX + targetRotX - flag.rotation.x) * 0.08;
      flag.rotation.y += (baseRotY + targetRotY - flag.rotation.y) * 0.08;

      renderer!.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVis);
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <canvas id="background" ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
    </div>
  );
};

export default NigerianWavesBackground;