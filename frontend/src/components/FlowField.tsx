import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const COLORS = ['111,242,216', '156,140,255', '255,181,71'];

/**
 * Fundo do topo: partículas que seguem um campo de fluxo, como rotas de entrega.
 * Decorativo (aria-hidden). Com reduced-motion desenha um quadro parado. Pausa fora da tela.
 */
export function FlowField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let t = 0;
    type P = { x: number; y: number; life: number; c: string };
    let ps: P[] = [];

    const spawn = (): P => ({ x: Math.random() * w, y: Math.random() * h, life: 60 + Math.random() * 140, c: '' });
    const color = (x: number) => COLORS[Math.min(2, Math.floor((x / Math.max(w, 1)) * 3))];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(320, (w * h) / 4200));
      ps = Array.from({ length: count }, spawn);
    }

    const angle = (x: number, y: number) =>
      Math.sin(x * 0.0021 + t * 0.15) * 1.6 + Math.cos(y * 0.0034 - t * 0.1) * 1.2 + Math.sin((x + y) * 0.0009) * 0.8;

    function step(fade: boolean) {
      if (fade) {
        ctx!.globalCompositeOperation = 'destination-out';
        ctx!.fillStyle = 'rgba(0,0,0,0.06)';
        ctx!.fillRect(0, 0, w, h);
        ctx!.globalCompositeOperation = 'source-over';
      }
      ctx!.lineWidth = 1.1;
      for (const p of ps) {
        const a = angle(p.x, p.y);
        const nx = p.x + Math.cos(a) * 1.4;
        const ny = p.y + Math.sin(a) * 1.4;
        ctx!.strokeStyle = `rgba(${color(p.x)},0.42)`;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(nx, ny);
        ctx!.stroke();
        p.x = nx;
        p.y = ny;
        if (--p.life <= 0 || nx < 0 || nx > w || ny < 0 || ny > h) Object.assign(p, spawn());
      }
    }

    function loop() {
      if (!visible) return;
      t += 0.016;
      step(true);
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduced) {
      for (let i = 0; i < 90; i++) step(false);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (!reduced && visible && !was) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      if (reduced) for (let i = 0; i < 90; i++) step(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
