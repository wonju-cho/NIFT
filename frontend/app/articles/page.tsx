import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArticleListing } from "@/components/article/article-listing"

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ArticleListing />
      </main>
      <Footer />
    </div>
  )
}