import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FormData = {
  title: string;
  price: number;
  description: string;
};

export function RegisterForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;

        onSubmit({ title, price, description });
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" type="text" required />
      </div>
      <div>
        <Label htmlFor="currentPrice">가격</Label>
        <Input id="price" name="price" type="number" step="0.01" required />
      </div>
      <div>
        <Label htmlFor="description">내용</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="상품에 대한 상세 설명을 입력하세요"
          className="h-[200px] resize-none"
        />
      </div>
      <Button type="submit" className="w-full text-white">
        상품 등록하기
      </Button>
    </form>
  );
}
