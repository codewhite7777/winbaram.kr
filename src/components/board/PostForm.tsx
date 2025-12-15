"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
  slug: string
}

type PostFormProps = {
  categories: Category[]
  initialData?: {
    id: string
    title: string
    content: string
    categoryId: string
  }
  categorySlug?: string
}

export function PostForm({ categories, initialData, categorySlug }: PostFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ||
    categories.find(c => c.slug === categorySlug)?.id ||
    categories[0]?.id || ""
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const url = isEdit ? `/api/posts/${initialData.id}` : "/api/posts"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, categoryId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "저장에 실패했습니다.")
      }

      const post = await res.json()
      const category = categories.find(c => c.id === categoryId)
      router.push(`/board/${category?.slug || categorySlug}/${post.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-amber-200 rounded">
      <div className="px-4 py-4 border-b border-amber-200">
        <h2 className="text-lg font-bold text-amber-900">
          {isEdit ? "게시글 수정" : "새 게시글 작성"}
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="제목을 입력하세요"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[300px]"
            placeholder="내용을 입력하세요"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-amber-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : isEdit ? "수정" : "등록"}
        </button>
      </div>
    </form>
  )
}
