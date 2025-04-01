import { Card, CardContent } from "@/components/ui/card"
import { Gift, Clock, Package, Heart, Settings } from "lucide-react"

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sidebarItems = [
  { icon: Gift, label: "보유 NIFT", value: "gifticons" },
  { icon: Clock, label: "거래 내역", value: "transactions" },
  { icon: Package, label: "선물 추억", value: "memories" },
  { icon: Heart, label: "찜한 상품", value: "favorites" },
  { icon: Settings, label: "설정", value: "settings" },
];

export function UserSidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-0">
        <nav className="flex flex-col">
          {sidebarItems.map((item) => (
            <button
              key={item.value}
              className={`flex items-center gap-3 border-l-4 px-6 py-4 text-left transition-colors ${
                activeTab === item.value
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              <item.icon
                className={`h-5 w-5 ${
                  activeTab === item.value ? "text-primary" : ""
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}