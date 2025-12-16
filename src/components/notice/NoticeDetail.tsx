"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

type Notice = {
  id: string
  title: string
  content: string
  type: string
  isPinned: boolean
  isPublished: boolean
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

type NoticeDetailProps = {
  notice: Notice
  isAdmin?: boolean
}

const typeLabels: Record<string, { label: string; color: string }> = {
  NOTICE: { label: "공지", color: "bg-blue-100 text-blue-700" },
  EVENT: { label: "이벤트", color: "bg-green-100 text-green-700" },
  UPDATE: { label: "업데이트", color: "bg-purple-100 text-purple-700" },
  MAINTENANCE: { label: "점검", color: "bg-red-100 text-red-700" },
}

export function NoticeDetail({ notice, isAdmin = false }: NoticeDetailProps) {
  const router = useRouter()
  const typeInfo = typeLabels[notice.type] || typeLabels.NOTICE

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPeriod = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null
    const format = (d: string) =>
      new Date(d).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    if (startDate && endDate) return `${format(startDate)} ~ ${format(endDate)}`
    if (startDate) return `${format(startDate)} ~`
    if (endDate) return `~ ${format(endDate)}`
    return null
  }

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/notices")
      } else {
        const data = await res.json()
        alert(data.error || "삭제에 실패했습니다.")
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  const period = formatPeriod(notice.startDate, notice.endDate)

  return (
    <article className="bg-white border border-amber-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs rounded ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {notice.isPinned && (
            <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700">
              고정
            </span>
          )}
          {!notice.isPublished && (
            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
              비공개
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">{notice.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate(notice.createdAt)}</span>
          {period && (
            <span className="text-amber-600">
              기간: {period}
            </span>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 mt-4">
            <Link
              href={`/notices/${notice.id}/edit`}
              className="px-3 py-1 text-sm border border-amber-500 text-amber-600 rounded hover:bg-amber-50 transition-colors"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6 min-h-[200px] whitespace-pre-wrap text-gray-800">
        {notice.content}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-amber-200 bg-amber-50">
        <Link
          href="/notices"
          className="text-amber-600 hover:text-amber-800 transition-colors"
        >
          ← 목록으로
        </Link>
      </div>
    </article>
  )
}
