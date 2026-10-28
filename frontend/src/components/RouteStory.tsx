import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { TimelineItem } from '../lib/timeline';

/**
 * A rota da minha história: a linha se acende conforme a página rola e cada parada liga
 * quando a linha chega nela. Com reduced-motion tudo aparece aceso de uma vez.
 */
export function RouteStory({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof window.requestAnimationFrame !== 'function') {
      el.style.setProperty('--progress', '1');
      setLit(items.length);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const line = window.innerHeight * 0.62;
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      el.style.setProperty('--progress', progress.toFixed(4));
      const stops = el.querySelectorAll<HTMLElement>('.route__stop');
      let n = 0;
      stops.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top + r.height / 2 <= line) n++;
      });
      setLit(n);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, items.length]);

  return (
    <div className="route" ref={ref}>
      <div className="route__track" aria-hidden="true"><div className="route__fill" /></div>
      <ol className="route__list">
        {items.map((t, i) => (
          <li key={t.title} className={i < lit ? 'route__stop is-lit' : 'route__stop'}>
            <span className="route__node" aria-hidden="true" />
            <div className="route__card">
              {t.when && <p className="route__when">{t.when}</p>}
              <h3 className="route__t">{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
