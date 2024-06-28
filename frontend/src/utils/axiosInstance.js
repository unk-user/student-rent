import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URI, // or process.env.REACT_APP_API_URI if you're using Create React App
  withCredentials: true,
});

export default axiosInstance;
