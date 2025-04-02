import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
  openMintModal?: (gifticonId: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  brand,
  openMintModal,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${id}`}>
        <div className="relative h-48">
          <Image
            src={image || "/placeholder.svg?height=200&width=200"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        {category && (
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            {brand && (
              <Badge variant="outline" className="ml-2 text-xs">
                {brand}
              </Badge>
            )}
          </div>
        )}
        <Link href={`/products/${id}`}>
          <h3 className="font-medium truncate hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">₩{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0">
        <Link href={`/products/edit/${id}`}>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            수정
          </Button>
        </Link>
        {openMintModal && (
          <Button
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => openMintModal(id)}
          >
            민팅
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
