import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface GiftRecipientFormProps {
  phone: string
  message: string
  isAnonymous: boolean
  setPhone: (val: string) => void
  setMessage: (val: string) => void
  setAnonymous: (val: boolean) => void
}

export function GiftRecipientForm({
  phone,
  message,
  isAnonymous,
  setPhone,
  setMessage,
  setAnonymous,
}: GiftRecipientFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">받는 사람 정보</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient-phone" className="block mb-1">
              받는 분 전화번호 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="recipient-phone"
              type="tel"
              placeholder="'-' 없이 숫자만 입력해주세요"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              className="rounded border-gray-300"
              checked={isAnonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <Label htmlFor="anonymous">익명으로 보내기</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}