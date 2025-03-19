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
    <div className={cn("relative", className)}>
      <div className="grid grid-rows-2 border-b">
        {/* 첫 번째 줄 */}
        <div className="flex w-full">
          {firstRow.map((category) => {
            const isActive = selectedCategories.includes(category.value)
            return (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "flex-1 whitespace-nowrap px-4 py-3 text-center text-sm font-medium transition-colors",
                  isActive ? "bg-gray-900 text-white" : "hover:text-primary",
                )}
              >
                {category.name}
              </button>
            )
          })}
        </div>

        {/* 두 번째 줄 */}
        <div className="flex w-full">
          {secondRow.map((category) => {
            const isActive = selectedCategories.includes(category.value)
            return (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "flex-1 whitespace-nowrap px-4 py-3 text-center text-sm font-medium transition-colors",
                  isActive ? "bg-gray-900 text-white" : "hover:text-primary",
                )}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

