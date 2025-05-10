import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Cart } from "./pages/Cart";
import { Home } from "./pages/Home";
import { Success } from "./pages/Success";
import { App } from "./App";

// Cria o conjunto de rotas usando a API de roteamento do React Router v6+
const router = createBrowserRouter([
  {
    // Rota principal da aplicação
    path: "/",

    // Componente base que será carregado para essa rota (geralmente contém o layout e <Outlet />)
    element: <App />,

    // Rotas filhas: serão renderizadas dentro do <Outlet /> do componente App
    children: [
      {
        // Quando o caminho for exatamente "/", carrega o componente Home
        path: "/",
        element: <Home />,
      },
      {
        // Quando o caminho for "/cart", carrega o componente Cart
        path: "/cart",
        element: <Cart />,
      },
      {
        // Rota com parâmetro dinâmico (ex: /order/123/success)
        path: "/order/:orderId/success",
        element: <Success />,
      },
    ],
  },
]);

// Encontra a div com id "root" no HTML (geralmente em index.html) e cria a raiz React
ReactDOM.createRoot(document.getElementById("root")!).render(
  // Habilita verificações adicionais de boas práticas em desenvolvimento
  <React.StrictMode>
    {/* Usa o RouterProvider para ativar o roteamento com as rotas configuradas acima */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
