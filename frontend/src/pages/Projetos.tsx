import { ProjectGrid } from '../components/ProjectGrid';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { projects } from '../lib/projects';

export function Projetos() {
  useDocumentTitle('Projetos');
  return (
    <div className="wrap page">
      <p className="eyebrow">Projetos</p>
      <h1 className="display">Sistemas reais, no ar.</h1>
      <p className="lead">
        Cada um tem backend em camadas, testes e deploy. Vários repositórios são privados (são de clientes ou da Lions
        Company), então mostro o sistema funcionando e conto as decisões — não o código. Clique em um projeto para ler o
        caso.
      </p>
      <ProjectGrid items={projects} headingLevel="h2" />
    </div>
  );
}
