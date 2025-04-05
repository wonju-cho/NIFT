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

  // 특정 판매자의 ON_SALE 중인 다른 상품 조회
  async getOtherArticlesByUser(userId: number, page: number = 0, size: number = 6) {
    try {
      const response = await axios.get(`${API_BASE_URL}/secondhand-articles/others`, {
        params: {
          userId,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("🔥 판매자의 다른 상품 조회 실패:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
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

export async function Article5AService() {
  try {
    const response = await axios.get(`${API_BASE_URL}/secondhand-articles`, {
      params: {
        sort: "likes",
        page: 1,
        size: 5
      }
    });

    return response.data;
  } catch (error) {
    console.error("🔥 인기 상위 5개 조회 실패:", error);
    return { content: [], totalPages: 0 };
  }
}

export const brandColors: Record<string, string> = {
  "이디야커피": "#1E2A5A",
  "스타벅스": "#00704A",
  "던킨도너츠": "#F26A21",
  "배스킨라빈스": "#EF5DA8",
  "교촌치킨": "#A67C52",
  "버거킹": "#EC1C24",
  "맥도날드": "#FFC72C",
  "BBQ": "#D7182A",
  "굽네치킨": "#E60012",
  "파리바게뜨": "#002C5F",
  "뚜레쥬르": "#6A9D4F",
  "이마트24": "#FDC300",
  "GS25": "#00AEEF",
  "CU": "#8331A7",
  "컬리": "#512072",
  "신세계상품권": "#B01116",
  "교보문고": "#1C4C3F",
  "YES24": "#0078D7",
  "투썸플레이스": "#000000",
  "CGV": "#EF3E43",
  "메가 커피": "#F7C600",
};
