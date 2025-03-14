export const sendKakaoTokenToBackend = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
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