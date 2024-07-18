import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: ''
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export default {
  async getAirdrop(url: string) {
    try {
      const result = await axiosInstance.get(url);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
