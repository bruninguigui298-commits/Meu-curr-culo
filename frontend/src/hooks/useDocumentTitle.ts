import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — Bruno Pereira Bento` : 'Bruno Pereira Bento — desenvolvedor back-end';
  }, [title]);
}
