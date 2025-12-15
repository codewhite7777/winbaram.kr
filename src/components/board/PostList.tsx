"use client"

import Link from "next/link"

type Post = {
  id: string
  title: string
  slug: string
  viewCount: number
  createdAt: string
  author: { id: string; name: string | null }
  category: { id: string; name: string; slug: string }
  _count: { comments: number }
  isNotice: boolean
}

type PostListProps = {
  posts: Post[]
  categorySlug?: string
}

export function PostList({ posts, categorySlug }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        게시글이 없습니다.
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })
  }

  return (
    <div className="bg-white border border-amber-200 rounded">
      {/* 헤더 */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-amber-100 border-b border-amber-200 text-sm font-medium text-amber-900">
        <div className="col-span-6 sm:col-span-7">제목</div>
        <div className="col-span-2 text-center hidden sm:block">글쓴이</div>
        <div className="col-span-3 sm:col-span-2 text-center">날짜</div>
        <div className="col-span-3 sm:col-span-1 text-center">조회</div>
      </div>

      {/* 게시글 목록 */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-amber-100 hover:bg-amber-50 text-sm"
        >
          <div className="col-span-6 sm:col-span-7">
            <Link
              href={`/board/${categorySlug || post.category.slug}/${post.id}`}
              className="hover:text-amber-700 flex items-center gap-2"
            >
              {post.isNotice && (
                <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                  공지
                </span>
              )}
              <span className="truncate">{post.title}</span>
              {post._count.comments > 0 && (
                <span className="text-amber-600 text-xs">[{post._count.comments}]</span>
              )}
            </Link>
          </div>
          <div className="col-span-2 text-center text-gray-600 hidden sm:block truncate">
            {post.author.name || "익명"}
          </div>
          <div className="col-span-3 sm:col-span-2 text-center text-gray-500">
            {formatDate(post.createdAt)}
          </div>
          <div className="col-span-3 sm:col-span-1 text-center text-gray-500">
            {post.viewCount}
          </div>
        </div>
      ))}
    </div>
  )
}
