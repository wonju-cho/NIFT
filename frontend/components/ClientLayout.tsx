"use client";

import { LoadingProvider } from "@/components/LoadingContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}