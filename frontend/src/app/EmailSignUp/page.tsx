import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailSignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center">
          <div className="border border-red-300 p-4">
            <div className="flex items-center">
              <div className="mr-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5L33.66 12.5V27.5L20 35L6.34 27.5V12.5L20 5Z"
                    stroke="#9333EA"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M20 5L33.66 12.5L20 20L6.34 12.5L20 5Z" stroke="#9333EA" strokeWidth="2" fill="none" />
                  <path d="M20 20V35" stroke="#9333EA" strokeWidth="2" />
                  <path d="M33.66 12.5V27.5" stroke="#9333EA" strokeWidth="2" />
                  <path d="M6.34 12.5V27.5" stroke="#9333EA" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-700">NIFT</span>
            </div>
          </div>
          <nav className="ml-8">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-2 py-4">
                  홈
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 px-2 py-4">
                  중고거래
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 px-2 py-4">
                  마이페이지
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-100 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">이메일로 시작하기</CardTitle>
            <CardDescription className="text-center">계정 정보를 입력하여 가입하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" type="text" />
              </div>
              <div className="pt-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">가입하기</Button>
              </div>
              <div className="text-center text-sm text-gray-500">
                이미 계정이 있으신가요?{" "}
                <Link href="/" className="text-purple-600 hover:underline">
                  로그인
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

