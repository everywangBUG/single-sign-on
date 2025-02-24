// App.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [username, setUserName] = useState<{ username?: string; password?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 提取 access_token 和 refresh_token：
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');

    // 验证 access_token：
    const validateAccessToken = (token: string) => {
      return axios.post('http://localhost:3000/validate', { token })
        .then(response => {
          if (response.data.iat) {
            setUserName(response.data.username);
          } else {
            throw new Error('Invalid access token');
          }
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          throw error;
        });
    };

    // 刷新 access_token：
    const refreshAccessToken = (refreshToken: string) => {
      return axios.post('http://localhost:3000/refresh', { token: refreshToken })
        .then(response => {
          const newAccessToken = response.data.access_token;
          localStorage.setItem('token', newAccessToken);
          return newAccessToken;
        })
        .catch(error => {
          console.error('Refresh token failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
          throw error;
        });
    };

    if (accessToken) {
      validateAccessToken(accessToken)
        .catch(() => {
          if (refreshToken) {
            refreshAccessToken(refreshToken)
              .then(newAccessToken => validateAccessToken(newAccessToken))
              .catch(() => {
                navigate('/login');
              });
          } else {
            navigate('/login');
          }
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      {username ? (
        <h1>Welcome, {username}!</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default App;