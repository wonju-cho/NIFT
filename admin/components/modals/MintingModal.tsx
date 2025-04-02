// components/MintingModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { mintNFT } from "@/lib/mintNFT";

export default function MintingModal({ open, setOpen, product }: any) {
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    if (!product) return;

    try {
      setMinting(true);
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = address[0];

      const txHash = await mintNFT({
        userAddress,
        gifticonId: product.gifticonId,
        quantity,
        price: product.price,
        name: product.gifticonTitle,
        description: product.description,
        metadataURI: product.imageUrl || "ipfs://default",
      });

      console.log("✅ 민팅 성공:", txHash);
    } catch (err) {
      console.error("❌ 민팅 실패:", err);
    } finally {
      setMinting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>민팅하기</DialogTitle>
          <DialogDescription>
            {product?.gifticonTitle} NFT를 민팅합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <span>수량</span>
          <Input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <DialogFooter>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleMint}
            disabled={minting}
          >
            {minting ? "발급 중..." : "발급하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
