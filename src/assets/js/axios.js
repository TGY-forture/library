import axios from 'axios';

axios.defaults.baseURL = 'https://10.136.21.90:5000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken && accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken;
    config.headers.RefreshToken = refreshToken;
  }
  return config;
});

axios.interceptors.response.use((response) => {
  const { accessToken, refreshToken } = response.data;
  const { location } = response.headers;
  if (location !== undefined) {
    window.location.href = location;
    return response;
  }
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  return response;
})

export default axios;