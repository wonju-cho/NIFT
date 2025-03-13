import "./globals.css";  // 전역 스타일

export const metadata = {
  title: "My Next.js App",
  description: "Next.js 13 App Router Example",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 헤더, 네비게이션 등 공통 레이아웃 */}
        <nav>
          <a href="/">Home</a> | <a href="/about">About</a> | <a href="/users">Users</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
