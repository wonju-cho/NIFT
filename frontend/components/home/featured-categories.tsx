import Link from "next/link"
import { cn } from "@/lib/utils"
import { Coffee, Cake, IceCream, Drumstick, Pizza, ShoppingBag, Gift, Film } from "lucide-react"

const categories = [
  {
    name: "커피/음료",
    icon: <Coffee className="h-6 w-6" />,
    href: "/articles/coffee",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "베이커리/디저트",
    icon: <Cake className="h-6 w-6" />,
    href: "/articles/vouchers",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "아이스크림/빙수",
    icon: <IceCream className="h-6 w-6" />,
    href: "/articles/delivery",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "치킨",
    icon: <Drumstick className="h-6 w-6" />,
    href: "/articles/convenience",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "피자/버거",
    icon: <Pizza className="h-6 w-6" />,
    href: "/articles/food",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "편의점/마트",
    icon: <ShoppingBag className="h-6 w-6" />,
    href: "/articles/beauty",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "상품권/금액권",
    icon: <Gift className="h-6 w-6" />,
    href: "/articles/gas",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "영화/도서",
    icon: <Film className="h-6 w-6" />,
    href: "/articles/culture",
    color: "bg-purple-100 text-purple-700",
  },
  // {
  //   name: "외식",
  //   icon: <Utensils className="h-6 w-6" />,
  //   href: "/articles/dining",
  //   color: "bg-orange-100 text-orange-700",
  // },
]

export function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">카테고리별 상품</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-gray-100"
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", category.color)}>
                {category.icon}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

