import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductListing } from "@/components/product/product-listing"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProductListing />
      </main>
      <Footer />
    </div>
  )
}