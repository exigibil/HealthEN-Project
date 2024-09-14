import axios from 'axios';


axios.interceptors.response.use(
  (response) => {

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');


      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
     
        const { data } = await axios.post('http://localhost:8000/auth/refresh-token', { refreshToken });

       
        localStorage.setItem('token', data.accessToken);

        
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

    
        return axios(originalRequest);
      } catch (err) {
    
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
