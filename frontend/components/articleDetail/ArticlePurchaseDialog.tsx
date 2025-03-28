// components/article/ArticlePurchaseDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type ArticlePurchaseDialogProps = {
  articleTitle: string;
  articlePrice: number;
  serialNum: number;
  amount: number;
  setAmount: (value: number) => void;
  loading: boolean;
  purchaseStatus: "idle" | "loading" | "success" | "error";
  errorMessage: string;
  onBuy: (serialNum: number) => void;
  onClose: () => void;
};

export function ArticlePurchaseDialog({
  articleTitle,
  articlePrice,
  serialNum,
  amount,
  setAmount,
  loading,
  purchaseStatus,
  errorMessage,
  onBuy,
  onClose,
}: ArticlePurchaseDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className="h-12 w-full px-[16px]" size="lg">
          <ShoppingCart className="mr-1 h-4 w-4" /> 구매하기
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>NFT 기프티콘 구매</DialogTitle>
          <DialogDescription>
            {articleTitle} {amount}개를 구매합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">상품명</span>
              <span className="font-medium">{articleTitle}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">수량</span>
              <span className="font-medium">{amount}개</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">가격</span>
              <span className="font-medium">
                {(articlePrice * amount).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">총 결제금액</span>
              <span className="text-lg font-bold text-primary">
                {(articlePrice * amount).toLocaleString()}원
              </span>
            </div>
          </div>

          {purchaseStatus === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {purchaseStatus === "success" && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>구매 완료</AlertTitle>
              <AlertDescription>
                {amount}개의 NFT를 성공적으로 구매했습니다!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button
            onClick={() => onBuy(serialNum)}
            disabled={loading || purchaseStatus === "success"}
          >
            {loading ? (
              <>
                <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                처리 중...
              </>
            ) : purchaseStatus === "success" ? (
              "구매 완료"
            ) : (
              "구매 확인"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
