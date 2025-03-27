"use client"

import type React from "react"

import { useEffect, useState } from "react";
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Mail, User } from "lucide-react"
import { fetchKakaoFriends } from "@/app/api/kakao-friends"
import * as Dialog from "@radix-ui/react-dialog"

interface MessageFormProps {
  recipientName: string
  message: string
  onRecipientChange: (name: string) => void
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

interface Friend {
  uuid: string // 카카오의 친구 식별자
  kakaoId: number // 카카오의 회원 번호호
  profile_nickname: string
  profile_thumbnail_image: string
}

export function MessageForm({ 
  recipientName,
  message, 
  onRecipientChange, 
  onMessageChange 
}: MessageFormProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedId, setSelectedId] = useState<number | "">("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const token = localStorage.getItem("kakao_access_token") // 또는 prop으로 전달
        if (!token) return

        const result = await fetchKakaoFriends(token)
        setFriends(result)
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err)
      }
    }
    loadFriends()
  }, [])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kakaoId = Number(e.target.value)
    const selected = friends.find(f => f.kakaoId === kakaoId)
    setSelectedId(kakaoId)
    if (selected) {
      onRecipientChange(selected.profile_nickname)
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2">메시지 작성 (카드 뒷면에 표시됩니다)</h3>
      <div className="grid gap-4">
      <div>
          <label className="block text-sm mb-1 flex items-center">
            <User className="h-4 w-4 mr-1" /> 받는 사람
          </label>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="w-full border px-3 py-2 rounded bg-white text-left">
                {recipientName || "받는 사람을 선택하세요"}
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30" />
              <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg">
                <Dialog.Title className="text-lg font-medium mb-4">친구 선택</Dialog.Title>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto">
                  {friends.map((friend) => (
                    <button
                      key={friend.kakaoId}
                      onClick={() => {
                        onRecipientChange(friend.profile_nickname)
                        setSelectedId(friend.kakaoId)
                        setOpen(false)
                      }}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition"
                    >
                      <div className="w-10 h-10 rounded-full border border-gray-300 p-[2px] bg-white">
                        <Image
                          src={friend.profile_thumbnail_image || "/1.png"}
                          alt="프로필"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span>{friend.profile_nickname}</span>
                    </button>
                  ))}
                </div>
                <Dialog.Close asChild>
                  <button className="mt-4 text-sm text-gray-500 hover:underline">닫기</button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>


        <div>
          <label htmlFor="message" className="block text-sm mb-1 flex items-center">
            <Mail className="h-4 w-4 mr-1" /> 메시지
          </label>
          <Textarea
            id="message"
            placeholder="마음을 담은 메시지를 작성해보세요."
            rows={4}
            value={message}
            onChange={onMessageChange}
          />
        </div>
      </div>
    </div>
  )
}

