import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftPaymentButtonProps {
  article: any; // 가격 정보 등
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function GiftPaymentButton({
  article,
  isLoading,
  onClick,
  disabled = false,
}: GiftPaymentButtonProps) {
  console.log("disabled 체크", disabled);

  return (
    <Button
      className="w-full mt-4"
      size="lg"
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          결제 처리 중...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          {article.price.toLocaleString()}원 결제하기
        </span>
      )}
    </Button>
  );
}
