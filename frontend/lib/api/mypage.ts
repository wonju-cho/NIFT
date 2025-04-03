import { apiClient } from "./CustomAxios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LikedArticle {
  articleId: number;
  title: string;
  imageUrl: string;
  countLikes: number;
  currentPrice: number;
  state: string;
}

export const deleteUser = async () => {
  const response = await apiClient.delete("/users/me");
  return response;
};

export const updateUserNickname = async (nickname: string) => {
  const response = await apiClient.patch("/users/nickname", {
    nickname: nickname,
  });
  return response;
};

export const updateWallet = async (walletAddress: string) => {
  const response = await apiClient.patch("/users/wallet", {
    walletAddress: walletAddress,
  });
  return response;
};

export async function fetchLikedArticles(
  page: number
): Promise<{ totalPage: number; likes: LikedArticle[] }> {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("Access Token이 없습니다. 로그인 필요.");
    return { totalPage: 1, likes: [] };
  }

  try {
    const response = await fetch(`${BASE_URL}/users/likes?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return await response.json(); // { totalPage, likes: [...] }
  } catch (error) {
    console.error("찜한 상품 불러오기 실패:", error);
    return { totalPage: 1, likes: [] };
  }
}
