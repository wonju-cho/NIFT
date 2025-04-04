import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function ProductTable({
  products,
  openMintModal,
}: {
  products: any[];
  openMintModal: (gifticonId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">번호</TableHead>
            <TableHead>기프티콘 이름</TableHead>
            <TableHead>브랜드</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead className="text-right">금액</TableHead>
            <TableHead>등록일시</TableHead>
            <TableHead className="text-center">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.gifticonId}>
              <TableCell className="text-center">
                {product.gifticonId}
              </TableCell>
              <TableCell>{product.gifticonTitle ?? "제목 없음"}</TableCell>
              <TableCell>{product.brandName ?? "브랜드 없음"}</TableCell>
              <TableCell>{product.categoryName ?? "기타"}</TableCell>
              <TableCell className="text-right">
               🪙 {Math.floor(product.price).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                  <span>
                    {product.createdAt ? product.createdAt + " 12:00" : "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Link href={`/products/${product.gifticonId}`}>
                    <Button
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                      size="sm"
                    >
                      보기
                    </Button>
                  </Link>
                  <Link href={`/products/edit/${product.gifticonId}`}>
                    <Button
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                      size="sm"
                    >
                      수정
                    </Button>
                  </Link>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={() => openMintModal(product)} // Pass the entire product object
                  >
                    민팅
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
