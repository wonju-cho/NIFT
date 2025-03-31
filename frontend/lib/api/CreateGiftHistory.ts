import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateGiftHistoryParams {
  fromUserId: number
  toUserId: number | null
  gifticonId: number
}

export async function sendGiftHistory(
  accessToken: string,
  dto: {
    toUserKakaoId: number,
    gifticonId: number,
    mongoId: string,
    type: string
  }
) {
  const res = await fetch(`${BASE_URL}/gift-histories/send`,{
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("선물 보내기 실패");
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

export async function postCardDesign(cardData: any, accessToken: string): Promise<string> {
  try {
    const res = await axios.post(
      `${BASE_URL}/gift-histories/cards`,
      cardData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

    if (res.status === 200 || res.status === 201) {
      console.log("🎉 카드 저장 성공! mongoId:", res.data)
      return res.data // mongo_id 반환
    } else {
      throw new Error(`카드 저장 실패: 상태 코드 ${res.status}`)
    }
  } catch (error: any) {
    console.error("카드 저장 실패:", error.response?.data || error.message)
    throw error
  }
}

export async function getCardDesignById(mongoId: string, accessToken: string): Promise<any> {
  try {
    const res = await axios.get(`${BASE_URL}/gift-histories/cards/${mongoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    if (res.status === 200){
      console.log("카드 디자인 조회 성공: ", res.data);
      return res.data;
    } else {
      throw new Error(`카드 조회 실패: 상태 코드 ${res.status}`)
    }
  } catch (error: any) {
    console.error("카드 조회 실패: ", error.response?.data || error.message)
  }
}

export async function getGifticonById(id: string){
  try {
    const res = await fetch(`${BASE_URL}/gifticons/${id}`)

    if (!res.ok) throw new Error("gifticon 조회 실패");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("gifticon 조회 실패: ", err);
    throw err;
  }
}