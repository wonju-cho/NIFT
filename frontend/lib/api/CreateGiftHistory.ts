// lib/api/CreateGiftHistory.ts
import axios from "axios"

interface CreateGiftHistoryParams {
  fromUserId: number
  toUserId: number | null
  gifticonId: number
}

export async function createGiftHistory({
  fromUserId,
  toUserId,
  gifticonId,
}: CreateGiftHistoryParams): Promise<void> {
  try {
    const res = await axios.post("/api/gift-histories", {
      fromUserId,
      toUserId,
      gifticonId,
    })

    if (res.status === 200 || res.status === 201) {
      console.log("🎁 gift_histories 등록 성공")
    } else {
      console.warn("gift_histories 등록 응답 상태:", res.status)
    }
  } catch (error: any) {
    console.error("gift_histories 등록 실패:", error.response?.data || error.message)
    throw error
  }
}