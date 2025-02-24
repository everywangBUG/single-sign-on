import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:3000', // 替换为你的 API 地址
  timeout: 10000, // 请求超时时间
});

let isRefreshing = false; // 是否正在刷新 Token
let failedQueue: any[] = []; // 存储刷新期间失败的请求

// 处理队列中的请求
const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 请求拦截器：添加 Token
instance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：处理 Token 刷新
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 检测 401 错误且不是刷新请求
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 将请求加入队列，等待刷新完成
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // 重新设置 Authorization 头
            originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // 刷新 Token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://localhost:3000/refresh', { refresh_token: refreshToken });
        const newAccessToken = response.data.access_token;

        // 更新本地存储的 Access Token
        localStorage.setItem('token', newAccessToken);
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 处理队列中的请求
        processQueue(null, newAccessToken);
        return instance(originalRequest);
      } catch (err) {
        // 刷新失败，清除 Token 并跳转登录页
        processQueue(err, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;