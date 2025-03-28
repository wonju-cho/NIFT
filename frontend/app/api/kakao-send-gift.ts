import axios from "axios"

interface SendKakaoGiftMessageParams {
  accessToken: string // 사용자 access token
  templateId: number // 메시지 템플릿 ID (예: 118821)
  imageUrl: string // 사용자 인자에 쓸 이미지 URL
}

export async function sendKakaoGiftMessage({
  accessToken,
  templateId,
  imageUrl,
}: SendKakaoGiftMessageParams): Promise<void> {
  try {
    const res = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/send",
      new URLSearchParams({
        template_id: templateId.toString(),
        template_args: JSON.stringify({
          THU: imageUrl, // 사용자 인자에 THU 키로 이미지 URL 삽입
        }),
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    if (res.status === 200) {
      console.log("카카오 메시지 전송 성공")
    } else {
      console.warn("카카오 메시지 전송 응답 상태:", res.status)
    }
  } catch (error: any) {
    console.error("카카오 메시지 전송 실패:", error.response?.data || error.message)
  }
}