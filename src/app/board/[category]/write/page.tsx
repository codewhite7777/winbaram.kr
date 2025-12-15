import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/board"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ category: string }>
}

export default async function WritePostPage({ params }: PageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { category: categorySlug } = await params

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <PostForm categories={categories} categorySlug={categorySlug} />
    </div>
  )
}

export const metadata = {
  title: "새 게시글 작성 - 바람의 나라",
}
