const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const sendKakaoTokenToBackend = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: token }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("백엔드 요청 실패:", error);
      return null;
    }
  };