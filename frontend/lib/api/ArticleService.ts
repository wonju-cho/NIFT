import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // 백엔드 API 주소

export const ArticleService = {
  async getArticles(
    sort: string = "newest",
    category?: number,
    page: number = 0,
    size: number = 15,
    userId?: number
  ) {
    try {
      const response = await axios.get(`${API_BASE_URL}/secondhand-articles`, {
        params: {
          sort,
          category,
          page,
          size,
          userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("상품 목록을 가져오는 중 오류 발생:", error);
      throw error;
    }
  },

  // 좋아요 추가 또는 삭제
  async toggleLike(articleId: number, isLiked: boolean) {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const url = `${API_BASE_URL}/secondhand-articles/${articleId}/likes`;
    const method = isLiked ? "DELETE" : "POST";

    try {
      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생 : ", error);
      return false;
    }
  },

  // 게시글 작성
  async createArticle(postData: {
    title: string;
    description: string;
    currentPrice: number;
    serialNum: string;
    expiryDate: string; // ISO 형식 (e.g. "2025-12-31T00:00:00")
    gifticonId: number;
    imageUrl: string;
  }) {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/secondhand-articles`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("게시글 등록 중 오류 발생:", error);
      throw error;
    }
  },

  // 게시글 삭제
  async deleteArticle(articleId: number): Promise<void> {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/secondhand-articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      throw error;
    }
  },
};

export async function getArticleById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/secondhand-articles/${id}`);

    if (!res.ok) throw new Error("second-articles 조회 실패");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("중고거래 상품 조회 실패: ", err)
    throw err;
  }
}