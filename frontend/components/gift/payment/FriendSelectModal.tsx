"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Friend {
  uuid: string
  kakaoId: number
  profile_nickname: string
  profile_thumbnail_image: string
}

interface FriendSelectModalProps {
  open: boolean
  onClose: () => void
  onSelect: (friend: Friend) => void
}

export function FriendSelectModal({ open, onClose, onSelect }: FriendSelectModalProps) {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    const token = localStorage.getItem("kakao_access_token")
    if (!token) return

    const fetchFriends = async () => {
      const res = await fetch("/api/kakao-friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setFriends(data)
    }

    fetchFriends()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>친구 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {friends.map((friend) => (
            <Button
              key={friend.uuid}
              variant="outline"
              className="w-full flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              onClick={() => onSelect(friend)}
            >
              <div className="relative w-6 h-6">
                <Image
                  src={friend.profile_thumbnail_image || "/1.png"}
                  alt="프로필"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {friend.profile_nickname}
            </Button>
          ))}
        </div>

        <div className="pt-4 text-right">
          <Button variant="ghost" onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
