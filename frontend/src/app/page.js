// export default function HomePage() {
//   return (
//     <h1>Hello from Next.js App Router!</h1>
//   );
// }

// import { Footer } from "@/components/layout/footer"
import KakaoLoginButton from "./component/KakaoLoginButton";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="container grid lg:grid-cols-2 min-h-[calc(100vh-4rem)] items-center">
          {/* 왼쪽: NFT 일러스트레이션 */}
          <div className="hidden lg:flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-8">NFT 기반 기프티콘 발행</h1>
            <div className="relative w-96 h-96">
              {/* <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EfCbwPfquqJxxLIrVSbjtiyyvfX50a.png"
                alt="NFT 기프티콘 일러스트레이션"
                fill
                className="object-contain"
                priority
              /> */}
            </div>
          </div>

          {/* 오른쪽: 회원가입 섹션 */}
          <div className="w-full max-w-md mx-auto lg:mr-0 bg-[#F8F9FA] p-12 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Nift 회원가입</h2>
              <p className="text-gray-600">
                간편하게 로그인하고
                <br />
                다양한 서비스를 이용해보세요.
              </p>
            </div>

            <div className="space-y-4">
              <KakaoLoginButton />
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}


