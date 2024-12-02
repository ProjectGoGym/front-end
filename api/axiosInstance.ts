import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://3.36.198.162:8080', // 기본 URL
  timeout: 10000, // 요청 제한 시간 (10초)
  headers: {
    'Content-Type': 'application/json', // 기본 헤더
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전에 토큰 추가 예시
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 가공
    return response.data;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버에서 응답을 받은 경우
      console.error('Error Response:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      console.error('No Response:', error.request);
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
