"use client";

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArticleListing } from "@/components/article/article-listing"
import { Suspense } from 'react'

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <ArticleListing />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}