import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CookieNotice } from './CookieNotice';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Ao trocar de página: volta ao topo e leva o foco ao conteúdo (leitores de tela anunciam a nova página).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CookieNotice />
    </>
  );
}
