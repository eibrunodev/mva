import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/global.scss'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './pages/Login/Login';
import Dash from './pages/Dashbord/Dash';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  }
  , {
    path: "/home",
    element: <Dash/>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
