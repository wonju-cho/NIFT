import Image from "next/image"
import { Copy, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserCardProps {
  user: {
    profileImage: string;
    nickname: string;
    walletAddress: string;
  };
  walletAddress: string | null;
  ssfBalance: string;
  copied: boolean;
  copyToClipboard: () => void;
  connectOrUpdateWallet: () => void;
}
const shortenAddress = (address: string | null) => (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "연결되지 않음")
export function UserCard({ user, walletAddress, ssfBalance, copied, copyToClipboard, connectOrUpdateWallet }: UserCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            src={user.profileImage || "/placeholder.svg"}
            alt={user.nickname}
            width={96}
            height={96}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <CardTitle className="text-center text-white">{user.nickname}</CardTitle>
        {walletAddress ? (
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm mt-1">
            <span className="truncate">{shortenAddress(walletAddress)}</span>
            <button onClick={copyToClipboard} className="ml-1 rounded-full p-1 hover:bg-white/20">
              <Copy className="h-3 w-3" />
              <span className="sr-only">복사</span>
            </button>
          </div>
        ) : (
          <button
            onClick={connectOrUpdateWallet}
            className="w-full rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm mt-2"
          >
            지갑 연결하기
          </button>
        )}
        {copied && (
          <div className="absolute right-4 top-4 rounded-md bg-white px-2 py-1 text-xs text-primary-700 shadow-md">
            복사됨!
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">보유 금액</span>
            <span className="font-medium">{ssfBalance} SSF</span>
          </div>
          <Button className="w-full">
            <CreditCard className="mr-2 h-4 w-4" /> 충전하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
