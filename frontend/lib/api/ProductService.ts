import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api" // 백엔드 API 주소

export const ProductService = {
  async getProducts(
    sort: string = "newest",
    category?: number,
    page: number = 0,
    size: number = 15,
    userId?: number
  ) {
    try {
      const response = await axios.get(`${API_BASE_URL}/secondhand/product`, {
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
  }
}