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

// 로컬 스토리지 키
const STORAGE_KEY = "nft-products"

// 모든 상품 가져오기
export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return initialProducts
  }

  try {
    const storedProducts = localStorage.getItem(STORAGE_KEY)
    if (!storedProducts) {
      // 로컬 스토리지에 데이터가 없으면 초기 데이터 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts))
      return initialProducts
    }
    return JSON.parse(storedProducts)
  } catch (error) {
    console.error("로컬 스토리지 접근 오류:", error)
    return initialProducts
  }
}

// ID로 상품 가져오기
export function getProductById(id: string): Product | undefined {
  const products = getAllProducts()
  return products.find((product) => product.id === id)
}

// 상품 추가하기
export function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const products = getAllProducts()
  const now = new Date().toISOString().split("T")[0]

  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  }

  const updatedProducts = [newProduct, ...products]

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))
  } catch (error) {
    console.error("로컬 스토리지 저장 오류:", error)
  }

  return newProduct
}

// 상품 업데이트하기
export function updateProduct(id: string, updatedFields: Partial<Product>): Product | undefined {
  const products = getAllProducts()
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    return undefined
  }

  const updatedProduct = {
    ...products[productIndex],
    ...updatedFields,
    updatedAt: new Date().toISOString().split("T")[0],
  }

  products[productIndex] = updatedProduct

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error("로컬 스토리지 저장 오류:", error)
  }

  return updatedProduct
}

// 상품 삭제하기
export function deleteProduct(id: string): boolean {
  const products = getAllProducts()
  const filteredProducts = products.filter((product) => product.id !== id)

  if (filteredProducts.length === products.length) {
    return false // 삭제할 상품이 없음
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts))
    return true
  } catch (error) {
    console.error("로컬 스토리지 저장 오류:", error)
    return false
  }
}

// 상품 필터링
export function filterProducts(options: {
  category?: string
  brand?: string
  searchTerm?: string
}): Product[] {
  const { category, brand, searchTerm } = options
  const products = getAllProducts()

  return products.filter((product) => {
    const matchCategory = !category || category === "all" || product.category === category
    const matchBrand = !brand || brand === "all" || product.brand === brand
    const matchSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchCategory && matchBrand && matchSearch
  })
}

// 모든 카테고리 가져오기
export function getAllCategories(): string[] {
  const products = getAllProducts()
  const categories = new Set(products.map((product) => product.category))
  return Array.from(categories)
}

// 모든 브랜드 가져오기
export function getAllBrands(): string[] {
  const products = getAllProducts()
  const brands = new Set(products.map((product) => product.brand))
  return Array.from(brands)
}

