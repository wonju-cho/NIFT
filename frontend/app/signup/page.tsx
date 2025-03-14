import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container grid lg:grid-cols-2 min-h-[calc(100vh-4rem)] items-center">
          {/* 왼쪽: NFT 일러스트레이션 */}
          <div className="hidden lg:flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-8">NFT 기반 기프티콘 발행</h1>
            <div className="relative w-96 h-96">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="NFT 기프티콘 일러스트레이션"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 오른쪽: 회원가입 섹션 */}
          <div className="w-full max-w-md mx-auto lg:mr-0 bg-gray-50 p-12 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Nift 회원가입</h2>
              <p className="text-gray-600">
                간편하게 로그인하고
                <br />
                다양한 서비스를 이용해보세요.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] hover:text-[#000000]/90"
                size="lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 208 191.94">
                  <path
                    d="M104,0C46.56,0,0,36.71,0,82c0,29.28,19.47,55,48.75,69.48-1.59,5.49-10.24,35.34-10.58,37.69,0,0-.21,1.76.93,2.43a3.14,3.14,0,0,0,2.48.15c3.28-.46,38-24.81,44-29A131.56,131.56,0,0,0,104,164c57.44,0,104-36.71,104-82S161.44,0,104,0ZM52.53,69.27c-.13,11.6.1,23.8-.09,35.22-.06,3.65-2.16,4.74-5,5.78a1.88,1.88,0,0,1-1,.07c-3.25-.64-5.84-1.8-5.92-5.84-.23-11.41.07-23.63-.09-35.23-2.75-.12-6.67.11-9.22,0-3.54-.23-6-2.48-5.85-5.83s1.94-5.76,5.91-5.82c9.38-.14,21-.14,30.38,0,4,.06,5.78,2.48,5.9,5.82s-2.3,5.6-5.83,5.83C59.2,69.38,55.29,69.15,52.53,69.27Zm50.4,40.45a9.24,9.24,0,0,1-3.82.83c-2.5,0-4.41-1-5-2.65l-3-7.78H72.85l-3,7.78c-.58,1.63-2.49,2.65-5,2.65a9.16,9.16,0,0,1-3.81-.83c-1.66-.76-3.25-2.86-1.43-8.52L74,63.42a9,9,0,0,1,8-5.92,9.07,9.07,0,0,1,8,5.93l14.34,37.76C106.17,106.86,104.58,109,102.93,109.72Zm30.32,0H114a5.64,5.64,0,0,1-5.75-5.5V63.5a6.13,6.13,0,0,1,12.25,0V98.75h12.75a5.51,5.51,0,1,1,0,11Zm47-4.52A6,6,0,0,1,169.49,108L155.42,89.37l-2.08,2.08v13.09a6,6,0,0,1-12,0v-41a6,6,0,0,1,12,0V76.4l16.74-16.74a4.64,4.64,0,0,1,3.33-1.34,6.08,6.08,0,0,1,5.9,5.58A4.7,4.7,0,0,1,178,67.55L164.3,81.22l14.77,19.57A6,6,0,0,1,180.22,105.23Z"
                    fill="#000000"
                  />
                </svg>
                카카오로 시작하기
              </Button>

              <div className="text-center">
                <Link href="/email-signup" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
                  다른 이메일로 시작하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

