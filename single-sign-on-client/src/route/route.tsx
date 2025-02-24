// react history 路由
import App from '../App';
import { createHashRouter } from 'react-router-dom';
import { Login } from '../login/login';
import { Home } from '../login/home';

export const router = createHashRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/home',
      element: <Home />,
    },
  ],
);
