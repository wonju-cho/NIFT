import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { RecentlyListed } from "@/components/home/recently-listed"
import { PopularProducts } from "@/components/home/popular-products"
import { NearbyItems } from "@/components/home/nearby-items"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <RecentlyListed />
        <PopularProducts />
        <NearbyItems />
      </main>
      <Footer />
    </div>
  )
}

