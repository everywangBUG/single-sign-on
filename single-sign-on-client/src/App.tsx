// App.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const App = () => {
  const [username, setUserName] = useState<{ username?: string; password?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 验证令牌
      axios.post('http://localhost:3000/validate', { token })
        .then(response => {
          // iat: 签发时间 exp: 过期时间
          if (response.data.iat) {
            setUserName(response.data.username);
          } else {
            localStorage.removeItem('token');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

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