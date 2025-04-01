import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PurchaseHistory } from "@/components/mypage/purchase-history"
import { SaleHistory } from "@/components/mypage/sale-history"
import { SendGiftHistory } from "@/components/mypage/sendgift-history"

export function TransactionsTab() {
  return (
    <div className="mt-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold">거래 내역</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          구매, 판매, 선물 내역을 확인 할 수 있습니다.
        </p>
      </div>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="purchases">
          <AccordionTrigger className="text-lg font-medium">구매내역</AccordionTrigger>
          <AccordionContent>
            <PurchaseHistory />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sales">
          <AccordionTrigger className="text-lg font-medium">판매내역</AccordionTrigger>
          <AccordionContent>
            <SaleHistory />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gifts">
          <AccordionTrigger className="text-lg font-medium">보낸 선물</AccordionTrigger>
          <AccordionContent>
            <SendGiftHistory />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
