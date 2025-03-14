import { ProductCard } from "@/components/product/product-card"

interface ProductGridProps {
  products: {
    id: string
    title: string
    price: number
    category: string
    image?: string
    location?: string
    distance?: string
    listedAt?: string
    isFavorite?: boolean
    isNew?: boolean
    isHot?: boolean
    originalPrice?: number
  }[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

