import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Home } from '../pages/Home';

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: reduce && q.includes('reduce'),
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function renderHome() {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

describe('abertura que se constrói', () => {
  beforeEach(() => sessionStorage.clear());

  it('com reduced-motion mostra tudo de uma vez, sem botão de pular', () => {
    mockMotion(true);
    renderHome();
    expect(screen.queryByRole('button', { name: 'Pular animação' })).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('is-in');
  });

  it('começa escondido e o botão "Pular" revela tudo e leva o foco à mensagem final', async () => {
    mockMotion(false);
    renderHome();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.className).not.toContain('is-in');
    await userEvent.click(screen.getByRole('button', { name: 'Pular animação' }));
    expect(h1.className).toContain('is-in');
    expect(document.activeElement?.className).toContain('term__foot');
    expect(sessionStorage.getItem('bp-intro-vista')).toBe('1');
  });

  it('termina sozinha e não repete na mesma sessão', async () => {
    mockMotion(false);
    vi.useFakeTimers();
    const { unmount } = renderHome();
    for (let i = 0; i < 200; i++) await act(async () => { vi.advanceTimersByTime(100); });
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('is-in');
    unmount();
    vi.useRealTimers();
    renderHome();
    expect(screen.queryByRole('button', { name: 'Pular animação' })).toBeNull();
  });

  it('o texto completo fica disponível para leitores de tela', () => {
    mockMotion(false);
    renderHome();
    expect(screen.getByText(/Pedido do Bruno à IA/)).toBeTruthy();
  });
});
