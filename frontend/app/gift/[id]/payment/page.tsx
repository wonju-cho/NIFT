"use client"

import GiftPaymentPageContent from "@/components/gift/payment/GiftPaymentPage"

export default function Page({ params }: { params: { id: string } }) {
  return <GiftPaymentPageContent params={params} />
}
