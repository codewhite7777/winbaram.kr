"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

type CommentFormProps = {
  postId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isReply = !!parentId

  if (!session) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Link href="/login" className="text-amber-600 hover:text-amber-700">
          댓글을 작성하려면 로그인이 필요합니다.
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError("")

    try {
      const body: { content: string; parentId?: string } = { content: content.trim() }
      if (parentId) {
        body.parentId = parentId
      }

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setContent("")
        onSuccess?.()
      } else {
        setError("댓글 작성에 실패했습니다.")
      }
    } catch {
      setError("오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={isReply ? "" : "mb-4"}>
      {error && (
        <div className="mb-2 text-sm text-red-500">{error}</div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? "답글을 입력하세요" : "댓글을 입력하세요"}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        rows={isReply ? 2 : 3}
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2 mt-2">
        {isReply && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 disabled:opacity-50"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  )
}
