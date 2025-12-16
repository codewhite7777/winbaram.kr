import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/board"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { PageLayout } from "@/components/layout"

type PageProps = {
  params: Promise<{ category: string; id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { category: categorySlug, id: postId } = await params

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      category: { select: { slug: true } },
    },
  })

  if (!post || post.category.slug !== categorySlug) {
    notFound()
  }

  // 작성자만 수정 가능
  if (post.authorId !== session.user?.id) {
    redirect(`/board/${categorySlug}/${postId}`)
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  return (
    <PageLayout>
      <PostForm
        categories={categories}
        categorySlug={categorySlug}
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content,
          categoryId: post.categoryId,
        }}
      />
    </PageLayout>
  )
}

export const metadata = {
  title: "게시글 수정 - 바람의 나라",
}
