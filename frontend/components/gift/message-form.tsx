"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, User } from "lucide-react"

interface MessageFormProps {
  recipientName: string
  message: string
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function MessageForm({ recipientName, message, onRecipientChange, onMessageChange }: MessageFormProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2">메시지 작성 (카드 뒷면에 표시됩니다)</h3>
      <div className="grid gap-4">
        <div>
          <label htmlFor="recipient" className="block text-sm mb-1 flex items-center">
            <User className="h-4 w-4 mr-1" /> 받는 사람
          </label>
          <Input
            id="recipient"
            placeholder="받는 사람의 이름을 입력하세요"
            value={recipientName}
            onChange={onRecipientChange}
          />
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