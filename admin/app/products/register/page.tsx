import PageHeader from "@/components/page-header";
import ProductForm from "@/components/product-register-form/ProductForm";

export default function RegisterPage() {
  return (
    <div>
      <PageHeader
        title="상품 등록"
        description="새로운 NFT 기프티콘 상품을 등록합니다."
      />
      <ProductForm />
    </div>
  );
}
