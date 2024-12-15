import axios from 'axios';

const csrf = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

export default csrf;