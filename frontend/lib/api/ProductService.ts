import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // 백엔드 API 주소

export const ProductService = {
  async getProducts(
    sort: string = "newest",
    category?: number,
    page: number = 0,
    size: number = 15,
    userId?: number
  ) {
    try {
      const response = await axios.get(`${API_BASE_URL}/secondhand-products`, {
        params: {
          sort,
          category,
          page,
          size,
          userId
        }
      })
      return response.data
    } catch (error) {
      console.error("상품 목록을 가져오는 중 오류 발생:", error)
      throw error
    }
  },

  // 좋아요 추가 또는 삭제
  async toggleLike(productId: number, isLiked: boolean) {
    const accessToken = typeof window !== "undefined" ?
        localStorage.getItem("access_token") : null;

    if (!accessToken){
      alert("로그인이 필요합니다.");
      return false;
    }

    const url = `${API_BASE_URL}/secondhand-products/${productId}/likes`;
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
  }
}
