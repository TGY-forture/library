import axios from 'axios';

axios.defaults.baseURL = 'https://10.136.21.90:5000';
axios.defaults.withCredentials = true;

export default axios;