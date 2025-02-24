const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = 'my-secret-key';
const REFRESH_SECRET_KEY = 'refresh-secret-key';

app.use(express.json());

// CAS跨域配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204); // 预检请求返回 204 No Content
  } else {
    next();
  }
})


// 用户登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 验证用户名和密码
  if (username === 'admin' && password === 'password') {
    // 签发token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
    res.json({ 
      access_token: token,
      expires_in: 30, // token过期时间15分钟
      refresh_token: refreshToken
    });
  } else {
    res.status(401).send('用户名或密码错误');
  }
})

app.post('/refresh', (req, res) => {
  const { refresh_token } = req.body;
  try {
    const decode = jwt.verify(refresh_token, REFRESH_SECRET_KEY);
    const token = jwt.sign({ username: decode.username }, SECRET_KEY, { expiresIn: '15m' });
    res.json({ access_token: token });
  } catch (error) {
    res.status(401).send('refresh_token验证失败');
  }
})

// 验证token
app.post('/validate', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send('token is missing');
  }
  try {
    const decode = jwt.verify(token, SECRET_KEY);
    res.json(decode);
  } catch (error) {
    res.status(401).send('token验证失败');
  }
})

app.get('/get/list', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  console.log(authHeader, 'authHeader')
  const token = authHeader.split(' ')[1];
  console.log(token, 'placeholder')
  if (!token) {
    return res.status(401).send('Token is missing');
  }

  if (blackList.has(token)) {
    return res.status(401).send('token已注销');
  }
  // 模拟返回列表数据
  try {
    jwt.verify(token, SECRET_KEY);
    res.json([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]);
  } catch(error) {
    res.status(401).send('token验证失败');
  }
})


const blackList = new Set();
// 注销功能
app.post('/logout', (req, res) => {
  const { token } = req.body;
  blackList.add(token);
  console.log(blackList, '令牌黑名单')
  res.send('注销成功');
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})