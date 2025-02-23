// react history 路由
import App from '../App';
import { createHashRouter } from 'react-router-dom';
import { Login } from '../login/login';

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
      path: '/validate',
      element: <div>About</div>,
    },
  ],
);
