"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type NoticeData = {
  id?: string
  title: string
  content: string
  type: string
  isPinned: boolean
  isPublished?: boolean
  startDate: string | null
  endDate: string | null
}

type NoticeFormProps = {
  initialData?: NoticeData
  isEdit?: boolean
}

const noticeTypes = [
  { value: "NOTICE", label: "공지사항" },
  { value: "EVENT", label: "이벤트" },
  { value: "UPDATE", label: "업데이트" },
  { value: "MAINTENANCE", label: "점검" },
]

export function NoticeForm({ initialData, isEdit = false }: NoticeFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [type, setType] = useState(initialData?.type || "NOTICE")
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? initialData.startDate.split("T")[0] : ""
  )
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? initialData.endDate.split("T")[0] : ""
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("제목을 입력해주세요.")
      return
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      const url = isEdit ? `/api/notices/${initialData?.id}` : "/api/notices"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          type,
          isPinned,
          isPublished,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "저장에 실패했습니다.")
      }

      router.push(`/notices/${data.notice.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-amber-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
        <h1 className="text-xl font-bold text-amber-900">
          {isEdit ? "공지사항 수정" : "공지사항 작성"}
        </h1>
      </div>

      <div className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isSubmitting}
          >
            {noticeTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            disabled={isSubmitting}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              시작일 (선택)
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              종료일 (선택)
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">상단 고정</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">공개</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "저장 중..." : isEdit ? "수정" : "등록"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </form>
  )
}
