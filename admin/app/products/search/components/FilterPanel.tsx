"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import React from "react";

type Props = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  orderStatus: string;
  setOrderStatus: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  resetFilters: () => void;
  categories: string[];
  brands: string[];
};

export default function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  orderStatus,
  setOrderStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetFilters,
  categories,
  brands,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-4 bg-gray-50 rounded-md">
      {/* 카테고리 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">카테고리</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="bg-white">
              전체
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="bg-white">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 브랜드 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">브랜드</label>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="bg-white">
              전체
            </SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand} className="bg-white">
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 주문 상태 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">주문 상태</label>
        <Select value={orderStatus} onValueChange={setOrderStatus}>
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="bg-white">
              전체
            </SelectItem>
            <SelectItem value="waiting" className="bg-white">
              대기중
            </SelectItem>
            <SelectItem value="processing" className="bg-white">
              처리중
            </SelectItem>
            <SelectItem value="completed" className="bg-white">
              완료
            </SelectItem>
            <SelectItem value="canceled" className="bg-white">
              취소됨
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 기간 필터 */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">기간 선택</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="date"
              className="pl-10"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="date"
              className="pl-10"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 필터 초기화 버튼 */}
      <div className="flex justify-end items-end">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <X className="h-4 w-4 mr-2" />
          필터 초기화
        </Button>
      </div>
    </div>
  );
}
