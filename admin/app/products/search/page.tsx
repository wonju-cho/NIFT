"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/page-header";

import SearchControls from "./components/SearchControls";
import FilterPanel from "./components/FilterPanel";
import ProductResults from "./components/ProductResults";
import MintingModal from "@/components/modals/MintingModal";

export default function ProductSearchPage() {
  const searchParams = useSearchParams();
  const initialTerm = searchParams.get("term") || "";

  // 상태들
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [showFilters, setShowFilters] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [mintModalOpen, setMintModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const openMintModal = (product: any) => {
    setSelectedProduct(product);
    setMintModalOpen(true);
  };

  const handleMint = (id: string, quantity: number) => {
    console.log("민팅 시작:", { id, quantity });
    // 여기에 스마트컨트랙트 mint 함수 호출 넣으면 됩니다
  };

  // 필터 적용
  const applyFilters = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("term", searchTerm);
    if (selectedCategory !== "all") params.append("category", selectedCategory);
    if (selectedBrand !== "all") params.append("brand", selectedBrand);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gifticons?${params.toString()}`
    );
    const data = await res.json();
    setFilteredProducts(data);
    setHasSearched(true);
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setOrderStatus("all");
    setStartDate("");
    setEndDate("");
    setFilteredProducts(products);
    setHasSearched(false);
  };

  // 초기 로딩
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gifticons`
        );
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ 상품 목록 불러오기 실패:", error);
      }
    };

    fetchProducts();
  }, []);
  // 활성 필터 수 계산
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0) +
    (orderStatus !== "all" ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="상품 검색"
        description="등록된 NFT 기프티콘 상품을 검색합니다."
      />

      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {showFilters && (
        <FilterPanel
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          resetFilters={resetFilters}
          categories={categories}
          brands={brands}
        />
      )}

      <ProductResults
        products={filteredProducts}
        viewMode={viewMode}
        hasSearched={hasSearched}
        openMintModal={openMintModal} // ✅ product 넘기는 구조로 연결됨
      />
      <MintingModal
        open={mintModalOpen}
        setOpen={setMintModalOpen}
        product={selectedProduct}
        handleMint={handleMint}
      />
    </div>
  );
}
