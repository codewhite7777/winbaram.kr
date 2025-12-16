import { prisma } from "@/lib/prisma"
import { PostList, SearchForm } from "@/components/board"
import Link from "next/link"
import { PageLayout } from "@/components/layout"

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>
}

const POSTS_PER_PAGE = 20

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query, page, category: categorySlug } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  if (!query) {
    return (
      <PageLayout>
        <h1 className="text-2xl font-bold text-amber-900 mb-4">게시글 검색</h1>
        <SearchFormWrapper />
        <div className="mt-8 text-center text-gray-500">검색어를 입력하세요.</div>
      </PageLayout>
    )
  }

  const where = {
    OR: [
      { title: { contains: query, mode: "insensitive" as const } },
      { content: { contains: query, mode: "insensitive" as const } },
    ],
    ...(categorySlug && { category: { slug: categorySlug } }),
  }

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Date를 string으로 변환
  const formattedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }))

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-amber-900 mb-4">검색 결과</h1>

      <SearchFormWrapper />

      <div className="mt-4 mb-4 text-sm text-gray-600">
        &quot;{query}&quot;에 대한 검색 결과 {totalCount}건
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">검색 결과가 없습니다.</div>
      ) : (
        <>
          <PostList posts={formattedPosts} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4">
              {currentPage > 1 && (
                <Link
                  href={`/board/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  이전
                </Link>
              )}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
                const pageNum = start + i
                if (pageNum > totalPages) return null
                return (
                  <Link
                    key={pageNum}
                    href={`/board/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                    className={`px-3 py-1.5 text-sm border rounded ${
                      pageNum === currentPage
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              })}
              {currentPage < totalPages && (
                <Link
                  href={`/board/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  다음
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}

// 클라이언트 래퍼 컴포넌트
function SearchFormWrapper() {
  return (
    <div className="bg-white border border-amber-200 rounded p-4">
      <SearchForm />
    </div>
  )
}

export const metadata = {
  title: "검색 - 바람의 나라",
}
