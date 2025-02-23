const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KE = 'my-secret-key';

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
  if (username === 'admin' && password === '111') {
    // 签发token
    const token = jwt.sign({ username }, SECRET_KE, { expiresIn: '1h' });
    res.json({ token});
  } else {
    res.status(401).send('用户名或密码错误');
  }
})

// 验证token
app.post('/validate', (req, res) => {
  const { token } = req.body;
  try {
    const decode = jwt.verify(token, SECRET_KE);
    res.json(decode);
  } catch (error) {
    res.status(401).send('token验证失败');
  }
})

// 注销功能
app.post('/logout', (req, res) => {
  const { token } = req.body;
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})