"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Post = {
  id: string
  title: string
  content: string
  viewCount: number
  createdAt: string
  updatedAt: string
  author: { id: string; name: string | null; image?: string | null }
  category: { id: string; name: string; slug: string }
  isNotice: boolean
}

type PostDetailProps = {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const isAuthor = session?.user?.id === post.author.id

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
      if (res.ok) {
        router.push(`/board/${post.category.slug}`)
      } else {
        alert("삭제에 실패했습니다.")
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <article className="bg-white border border-amber-200 rounded">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          {post.isNotice && (
            <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded">
              공지
            </span>
          )}
          <span className="text-amber-600 text-sm">[{post.category.name}]</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>작성자: {post.author.name || "익명"}</span>
            <span>작성일: {formatDate(post.createdAt)}</span>
            <span>조회수: {post.viewCount}</span>
          </div>
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                href={`/board/${post.category.slug}/${post.id}/edit`}
                className="text-amber-600 hover:text-amber-700"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 py-6 min-h-[200px] whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-3 border-t border-amber-200 flex justify-between">
        <Link
          href={`/board/${post.category.slug}`}
          className="px-4 py-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
        >
          목록
        </Link>
      </div>
    </article>
  )
}
