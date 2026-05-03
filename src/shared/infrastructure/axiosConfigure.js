import axios from 'axios';
import { requestStarted, requestDone, requestFailed} from './actions';

export const configure = (requestsDispatch, history) => {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'
  axios.defaults.withCredentials = true

  axios.interceptors.request.use(
    config => {
      requestsDispatch(requestStarted());

      return config;
    },
    error => {
      Promise.reject(error)
    },
  );

  axios.interceptors.response.use(
    (response) => {
      requestsDispatch(requestDone());

      return response;
    },
    async error => {
      if (!error.response) {
        requestsDispatch(requestDone());
        return Promise.reject(error.message);
      }

      const originalRequest = error.config;
      if (error.response.status === 401
        && error.response.data === 'Invalid authorization token\n'
        && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post('/auth/refreshtoken');
          if (res.status === 200) {
            return axios(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('userInfo');
          history.push('/login');
          return Promise.reject(refreshError);
        }
      }

      if (error.response.status === 401
        && (error.response.data === 'Invalid refresh token\n' || error.response.data === 'No authorization cookie\n')) {
        localStorage.removeItem('userInfo');
        history.push('/login');
      }

      if (error.response && error.response.config.url !== '/auth/login') {
        requestsDispatch(requestFailed(error.response.data));
      } else {
        requestsDispatch(requestDone());
      }

      return Promise.reject(error.response.data);
    }
  )
}