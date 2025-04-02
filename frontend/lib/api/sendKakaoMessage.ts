export async function sendKakaoMessage(
    accessToken: string,
    receiverUuids: string[],
    templateId: number,
    templateArgs: Record<string, string>
  ) {
    const res = await fetch("https://kapi.kakao.com/v1/api/talk/friends/message/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        receiver_uuids: JSON.stringify(receiverUuids),
        template_id: templateId.toString(),
        template_args: JSON.stringify(templateArgs),
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      console.error("카카오 메시지 전송 실패:", data);
      throw new Error(`카카오 메시지 전송 실패: ${data.msg || res.statusText}`);
    }

    // console.log(`${receiverUuids[0]} 친구에게 메시지 전송 성공했습니다.`);
  
    return data;
  }
  