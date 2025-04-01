"use client"; 

import { useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { fetchKakaoFriends } from "@/app/api/kakao-friends"
import { Button } from "@/components/ui/button"

interface Friend {
  uuid: string
  kakaoId: number
  profile_nickname: string
  profile_thumbnail_image: string
}

interface GiftRecipientFormProps {
  phone: string
  message: string
  isAnonymous: boolean
  setPhone: (val: string) => void
  setMessage: (val: string) => void
  setAnonymous: (val: boolean) => void
  selectedFriend: Friend | null
  setSelectedFriend: (val: Friend) => void
}

export function GiftRecipientForm({
  phone,
  message,
  isAnonymous,
  setPhone,
  setMessage,
  setAnonymous,
  selectedFriend,
  setSelectedFriend
}: GiftRecipientFormProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadFriends = async () => {
      const token = localStorage.getItem("kakao_access_token")
      if (!token) return
      try {
        const friends = await fetchKakaoFriends(token)
        setFriends(friends)
      } catch (err) {
        console.error("친구 목록 불러오기 실패", err)
      }
    }
    loadFriends()
  }, [])

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend)
    setPhone(friend.kakaoId.toString())
    setIsModalOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">받는 사람 정보</h2>
        <div className="space-y-4">
          <div>
            <Label className="block mb-1">받는 사람</Label>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              {selectedFriend ? selectedFriend.profile_nickname : "받을 사람을 선택하세요"}
            </Button>
          </div>

          <div>
            <Label htmlFor="recipient-message" className="block mb-1">
              받는 분께 보낼 메시지
            </Label>
            <Textarea
              id="recipient-message"
              placeholder="선물과 함께 보낼 메시지를 입력해주세요."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {/* 친구 선택 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-2">친구 선택</h3>
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {friends.map((friend) => (
                  <li
                    key={friend.uuid}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <Image
                      src={friend.profile_thumbnail_image || "/1.png"}
                      alt="프로필"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span>{friend.profile_nickname}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" variant="secondary" onClick={() => setIsModalOpen(false)}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}