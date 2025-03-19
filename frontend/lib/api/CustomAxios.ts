import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized → 토큰 재발급 처리
      if (status === 401) {
        console.error("Token refresh failed");
        localStorage.removeItem("access_token");
        localStorage.removeItem("kakao_access_token")
        window.location.href = "/login"; // 로그인 페이지로 이동
      }
    }

    return Promise.reject(error);
  }
);
