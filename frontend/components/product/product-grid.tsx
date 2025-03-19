import { ProductCard } from "@/components/product/product-card"

interface ProductListDto {
  productId: number
  categoryId: number
  categoryName: string
  brandName: string
  title: string
  description: string
  currentPrice: number
  originalPrice: number
  discountRate: number
  imageUrl: string
  countLikes: number
  viewCnt: number
  createdAt: string
  isLiked: boolean
}

interface ProductGridProps {
  products: ProductListDto[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          productId={product.productId}
          title={product.title}
          brandName={product.brandName}
          currentPrice={product.currentPrice}
          originalPrice={product.originalPrice}
          discountRate={product.discountRate}
          imageUrl={product.imageUrl}
          isLiked={product.isLiked}
        />
      ))}
    </div>
  )
}

