"use client"

import GiftPaymentPageContent from "@/components/gift/payment/GiftPaymentPage"

export default function Page({ 
  params,
  searchParams,
 }: { 
  params: { id: string };
  searchParams: { type: string };
}) {
  return <GiftPaymentPageContent params={params} type={searchParams.type} />
}
