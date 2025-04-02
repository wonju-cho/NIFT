import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MintingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: any;
  handleMint: (id: string, quantity: number) => void;
}

export default function MintingModal({
  open,
  setOpen,
  product,
  handleMint,
}: MintingModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>민팅하기</DialogTitle>
          <DialogDescription>
            {product.gifticonTitle}을 민팅합니다. 수량을 선택하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right">
              수량
            </label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
              type="number"
              min="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => handleMint(product.gifticonId, quantity)}
          >
            민팅
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
