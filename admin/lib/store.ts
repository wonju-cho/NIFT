import { create } from "zustand"
import { persist } from "zustand/middleware"

// 상품 타입 정의
export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  brand: string
  image: string
  stock: number
  validity: string
  nftDetails: {
    blockchain: string
    tokenId: string
    contract: string
    minted: string
  }
  createdAt: string
  updatedAt: string
}

// 초기 상품 데이터
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Starbucks 아메리카노",
    price: 4500,
    description: "스타벅스 아메리카노 기프티콘입니다. 전국 스타벅스 매장에서 사용 가능합니다.",
    category: "커피",
    brand: "Starbucks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 250,
    validity: "2025-12-31",
    nftDetails: {
      blockchain: "Ethereum",
      tokenId: "ETH-NFT-1234567890",
      contract: "0x1234567890abcdef1234567890abcdef12345678",
      minted: "2023-10-15",
    },
    createdAt: "2023-10-15",
    updatedAt: "2023-10-15",
  },
  {
    id: "2",
    name: "CGV 영화 티켓",
    price: 12000,
    description: "CGV 영화관에서 사용 가능한 영화 티켓입니다.",
    category: "영화",
    brand: "CGV",
    image: "/placeholder.svg?height=200&width=200",
    stock: 100,
    validity: "2025-12-31",
    nftDetails: {
      blockchain: "Ethereum",
      tokenId: "ETH-NFT-2345678901",
      contract: "0x1234567890abcdef1234567890abcdef12345678",
      minted: "2023-10-16",
    },
    createdAt: "2023-10-16",
    updatedAt: "2023-10-16",
  },
  {
    id: "3",
    name: "배스킨라빈스 파인트",
    price: 9900,
    description: "배스킨라빈스 파인트 아이스크림 교환권입니다.",
    category: "음식",
    brand: "배스킨라빈스",
    image: "/placeholder.svg?height=200&width=200",
    stock: 80,
    validity: "2025-12-31",
    nftDetails: {
      blockchain: "Ethereum",
      tokenId: "ETH-NFT-3456789012",
      contract: "0x1234567890abcdef1234567890abcdef12345678",
      minted: "2023-10-17",
    },
    createdAt: "2023-10-17",
    updatedAt: "2023-10-17",
  },
  {
    id: "4",
    name: "BBQ 치킨 기프티콘",
    price: 18000,
    description: "BBQ 치킨 교환권입니다. 전국 BBQ 매장에서 사용 가능합니다.",
    category: "음식",
    brand: "BBQ",
    image: "/placeholder.svg?height=200&width=200",
    stock: 50,
    validity: "2025-12-31",
    nftDetails: {
      blockchain: "Ethereum",
      tokenId: "ETH-NFT-4567890123",
      contract: "0x1234567890abcdef1234567890abcdef12345678",
      minted: "2023-10-18",
    },
    createdAt: "2023-10-18",
    updatedAt: "2023-10-18",
  },
]

// 스토어 타입 정의
interface ProductStore {
  products: Product[]
  isLoading: boolean
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  getProduct: (id: string) => Product | undefined
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getCategories: () => string[]
  getBrands: () => string[]
  filterProducts: (category?: string, brand?: string, searchTerm?: string) => Product[]
}

// Zustand 스토어 생성
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      isLoading: false,

      // 상품 추가
      addProduct: (product) => {
        const now = new Date().toISOString().split("T")[0]
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ products: [newProduct, ...state.products] }))
      },

      // 상품 조회
      getProduct: (id) => {
        return get().products.find((product) => product.id === id)
      },

      // 상품 업데이트
      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updatedFields,
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : product,
          ),
        }))
      },

      // 상품 삭제
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }))
      },

      // 카테고리 목록 가져오기
      getCategories: () => {
        const categories = new Set(get().products.map((product) => product.category))
        return Array.from(categories)
      },

      // 브랜드 목록 가져오기
      getBrands: () => {
        const brands = new Set(get().products.map((product) => product.brand))
        return Array.from(brands)
      },

      // 상품 필터링
      filterProducts: (category, brand, searchTerm) => {
        return get().products.filter((product) => {
          const matchCategory = !category || category === "all" || product.category === category
          const matchBrand = !brand || brand === "all" || product.brand === brand
          const matchSearch =
            !searchTerm ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          return matchCategory && matchBrand && matchSearch
        })
      },
    }),
    {
      name: "product-storage", // 로컬 스토리지 키 이름
      skipHydration: true, // 서버 사이드 렌더링 시 하이드레이션 건너뛰기
    },
  ),
)

// 클라이언트 사이드에서만 로컬 스토리지 초기화
if (typeof window !== "undefined") {
  useProductStore.persist.rehydrate()
}

