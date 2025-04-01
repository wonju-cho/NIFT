import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SettingsTabProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  walletAddress: string | null;
  copied: boolean;
  copyToClipboard: () => void;
  connectOrUpdateWallet: () => void;
  updateNickname: () => void;
  deleteProcess: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (val: boolean) => void;
}

export function SettingsTab({
  nickname,
  setNickname,
  walletAddress,
  copied,
  copyToClipboard,
  connectOrUpdateWallet,
  updateNickname,
  deleteProcess,
  showDeleteConfirm,
  setShowDeleteConfirm,
}: SettingsTabProps) {
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
          <CardDescription>개인 정보를 확인하고 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">닉네임</Label>
            <div className="flex gap-2">
              <Input id="name" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              <Button className="whitespace-nowrap" onClick={updateNickname}>
                수정
              </Button>
            </div>
          </div>
          <hr />
          <div className="space-y-2">
            <Label htmlFor="wallet">지갑 주소</Label>
            <div className="flex gap-2">
              <Input
                id="wallet"
                value={walletAddress ? walletAddress : "연결되지 않음"}
                readOnly
                className="bg-muted"
              />
              <Button
                variant="outline"
                className="whitespace-nowrap"
                onClick={connectOrUpdateWallet}
              >
                {walletAddress ? "변경하기" : "연결하기"}
              </Button>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>알림 수신 여부를 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">마케팅 알림</Label>
            <input
              type="checkbox"
              id="marketing"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="transaction">거래 알림</Label>
            <input
              type="checkbox"
              id="transaction"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              defaultChecked
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
          <CardDescription>계정 보안 설정을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
          <CardDescription>
            계정 관련 중요 설정을 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>주의</AlertTitle>
            <AlertDescription>
              회원 탈퇴 시 모든 계정 정보와 거래 내역이 삭제되며, 복구할 수 없습니다.
            </AlertDescription>
          </Alert>

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                회원 탈퇴
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
                <DialogDescription>
                  회원 탈퇴 시 모든 계정 정보와 거래 내역이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm">확인을 위해 "탈퇴합니다"를 입력하세요</Label>
                  <Input
                    id="confirm"
                    placeholder="탈퇴합니다"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  취소
                </Button>
                <Button variant="destructive" onClick={deleteProcess} disabled={confirmText !== "탈퇴합니다"}>
                  회원 탈퇴 진행
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
