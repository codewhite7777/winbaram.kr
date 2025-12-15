import { prisma } from "@/lib/prisma"
import { PostDetail } from "@/components/board"
import { CommentListWrapper } from "./CommentListWrapper"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ category: string; id: string }>
}

export default async function PostDetailPage({ params }: PageProps) {
  const { category: categorySlug, id: postId } = await params

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!post || post.category.slug !== categorySlug) {
    notFound()
  }

  // 조회수 증가
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  })

  // 댓글 가져오기 (대댓글 포함)
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      author: { select: { id: true, name: true, image: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  // Date를 string으로 변환
  const formattedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PostDetail post={formattedPost} />
      <CommentListWrapper postId={postId} initialComments={comments} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id: postId } = await params
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { title: true },
  })

  return {
    title: post ? `${post.title} - 바람의 나라` : "게시글",
  }
}
