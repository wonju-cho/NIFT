export interface Friend {
    uuid: string
    kakaoId: number
    profile_nickname: string
    profile_thumbnail_image: string
  }
  

export const fetchKakaoFriends = async (accessToken: string): Promise<Friend[]> => {
    const res = await fetch("https://kapi.kakao.com/v1/api/talk/friends", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  
    if (!res.ok) {
      throw new Error("카카오 친구 목록 요청 실패")
    }
  
    const data = await res.json()
  
    return data.elements.map((f: any) => ({
      uuid: f.uuid,
      kakaoId: f.id,
      profile_nickname: f.profile_nickname,
      profile_thumbnail_image: f.profile_thumbnail_image,
    }))
  }
  