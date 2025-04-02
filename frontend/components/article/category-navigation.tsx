"use client"
import { cn } from "@/lib/utils"

interface CategoryNavigationProps {
  categories: {
    name: string
    value: string
    highlight?: boolean
  }[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  className?: string
}

export function CategoryNavigation({
  categories,
  selectedCategories,
  onCategoryChange,
  className,
}: CategoryNavigationProps) {
  // 카테고리를 두 줄로 나누기 위한 계산
  const halfLength = Math.ceil(categories.length / 2)
  const firstRow = categories.slice(0, halfLength)
  const secondRow = categories.slice(halfLength)

  // 카테고리 토글 함수
  const toggleCategory = (categoryValue: string) => {
    if (selectedCategories.includes(categoryValue)) {
      // 이미 선택된 카테고리라면 제거
      onCategoryChange(selectedCategories.filter((c) => c !== categoryValue))
    } else {
      // 선택되지 않은 카테고리라면 추가
      onCategoryChange([...selectedCategories, categoryValue])
    }
  }

  return (
    <div className={cn("relative mb-6", className)}>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* 첫 번째 줄 */}
        <div className="flex w-full">
          {firstRow.map((category, index) => {
            const isActive = selectedCategories.includes(category.value)
            return (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "flex-1 whitespace-nowrap px-4 py-3.5 text-center text-sm transition-all relative",
                  isActive
                    ? "bg-primary/10 text-gray-900 font-semibold"
                    : "bg-white text-gray-600 hover:text-gray-800 font-normal",
                  "border-b border-r last:border-r-0 border-gray-200",
                )}
              >
                {category.name}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>}
              </button>
            )
          })}
        </div>

        {/* 두 번째 줄 */}
        <div className="flex w-full">
          {secondRow.map((category, index) => {
            const isActive = selectedCategories.includes(category.value)
            return (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "flex-1 whitespace-nowrap px-4 py-3.5 text-center text-sm transition-all relative",
                  isActive
                    ? "bg-primary/10 text-gray-900 font-semibold"
                    : "bg-white text-gray-600 hover:text-gray-800 font-normal",
                  "border-r last:border-r-0 border-gray-200",
                )}
              >
                {category.name}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

