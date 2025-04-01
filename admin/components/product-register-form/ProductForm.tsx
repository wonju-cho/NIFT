// 리팩토링된 구조
// components/product-register-form/ProductForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToPinata, uploadMetadataToPinata } from "@/lib/utils";

export default function ProductForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [brands, setBrands] = useState<
    { brandId: number; brandName: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { categoryId: number; categoryName: string }[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    gifticonId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const brandRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/brands`
      );
      const categoryRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      const brandsData = await brandRes.json();
      const categoriesData = await categoryRes.json();
      setBrands(brandsData);
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.name ||
        !formData.price ||
        !formData.category ||
        !formData.brand ||
        !formData.gifticonId
      ) {
        toast({
          title: "입력 오류",
          description: "필수 항목을 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      const fileInput = document.getElementById("image") as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (!file) throw new Error("이미지 파일이 없습니다.");

      const imageCid = await uploadImageToPinata(file);
      const imageUrl = `ipfs://${imageCid}`;

      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        attributes: [
          { trait_type: "브랜드", value: formData.brand },
          { trait_type: "카테고리", value: formData.category },
          { trait_type: "가격", value: formData.price },
          {
            trait_type: "시리얼넘버",
            value: "SN-" + crypto.randomUUID().slice(0, 8),
          },
        ],
      };

      const metadataCid = await uploadMetadataToPinata(metadata);
      const metadataUrl = `ipfs://${metadataCid}`;
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifticons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gifticonTitle: formData.name,
            price: Number(formData.price),
            brandId: Number(formData.brand),
            categoryId: Number(formData.category),
            imageUrl: imageUrl,
            metadataUrl: metadataUrl,
            description: formData.description,
            gifticonId: formData.gifticonId,
          }),
        }
      );

      console.log("📦 DB로 보낼 데이터:", {
        gifticonTitle: formData.name,
        price: Number(formData.price),
        brandId: Number(formData.brand),
        categoryId: Number(formData.category),
        imageUrl: imageUrl,
        metadataUrl: metadataUrl, // <-- 요거 확인!
        description: formData.description,
        gifticonId: formData.gifticonId,
      });

      if (!res.ok) throw new Error("DB 저장 실패");

      toast({
        title: "상품 등록 완료",
        description: "NFT 기프티콘이 등록되었습니다.",
      });
      router.push("/");
    } catch (error) {
      console.error("등록 오류:", error);
      toast({
        title: "등록 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border border-gray-300 rounded-2xl p-6 bg-white shadow-md"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">상품명 *</Label>
            <Input
              id="name"
              placeholder="상품명을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gifticonId">기프티콘 ID *</Label>
            <Input
              id="gifticonId"
              placeholder="기프티콘 ID를 입력하세요"
              value={formData.gifticonId}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">가격 *</Label>
            <Input
              id="price"
              type="number"
              placeholder="가격을 입력하세요"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리 *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.categoryId}
                    value={String(cat.categoryId)}
                    className="bg-white"
                  >
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brand">브랜드 *</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => handleSelectChange("brand", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="브랜드 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {brands.map((brand) => (
                  <SelectItem
                    key={brand.brandId}
                    value={String(brand.brandId)}
                    className="bg-white"
                  >
                    {brand.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">상품 설명</Label>
            <Textarea
              id="description"
              placeholder="상품에 대한 상세 설명을 입력하세요"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">상품 이미지</Label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="미리보기"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 등록 중...
            </>
          ) : (
            "상품 등록"
          )}
        </Button>
      </div>
    </form>
  );
}
