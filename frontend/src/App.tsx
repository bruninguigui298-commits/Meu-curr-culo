import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Admin } from './pages/Admin';
import { Caso } from './pages/Caso';
import { ComoTrabalho } from './pages/ComoTrabalho';
import { Contato } from './pages/Contato';
import { Cookies } from './pages/Cookies';
import { Curriculo } from './pages/Curriculo';
import { Home } from './pages/Home';
import { LinhaDoTempo } from './pages/LinhaDoTempo';
import { NotFound } from './pages/NotFound';
import { Privacidade } from './pages/Privacidade';
import { Projetos } from './pages/Projetos';
import { SeusDados } from './pages/SeusDados';
import { Sobre } from './pages/Sobre';
import { Termos } from './pages/Termos';

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/projetos', element: <Projetos /> },
      { path: '/projetos/:slug', element: <Caso /> },
      { path: '/como-trabalho-com-ia', element: <ComoTrabalho /> },
      { path: '/linha-do-tempo', element: <LinhaDoTempo /> },
      { path: '/contato', element: <Contato /> },
      { path: '/curriculo', element: <Curriculo /> },
      { path: '/privacidade', element: <Privacidade /> },
      { path: '/termos', element: <Termos /> },
      { path: '/cookies', element: <Cookies /> },
      { path: '/seus-dados', element: <SeusDados /> },
      { path: '/admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function App() {
  return <RouterProvider router={router} />;
}
