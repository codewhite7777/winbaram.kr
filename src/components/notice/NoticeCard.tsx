"use client"

import Link from "next/link"

type Notice = {
  id: string
  title: string
  type: string
  isPinned: boolean
  createdAt: string
}

type NoticeCardProps = {
  notices: Notice[]
  maxItems?: number
}

const typeLabels: Record<string, { label: string; color: string }> = {
  NOTICE: { label: "공지", color: "bg-blue-100 text-blue-700" },
  EVENT: { label: "이벤트", color: "bg-green-100 text-green-700" },
  UPDATE: { label: "업데이트", color: "bg-purple-100 text-purple-700" },
  MAINTENANCE: { label: "점검", color: "bg-red-100 text-red-700" },
}

export function NoticeCard({ notices, maxItems = 5 }: NoticeCardProps) {
  const displayNotices = notices.slice(0, maxItems)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex justify-between items-center">
        <h3 className="font-bold text-amber-900">공지사항</h3>
        <Link
          href="/notices"
          className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
        >
          더보기 →
        </Link>
      </div>

      {/* List */}
      {displayNotices.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500 text-sm">
          공지사항이 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-amber-100">
          {displayNotices.map((notice) => {
            const typeInfo = typeLabels[notice.type] || typeLabels.NOTICE

            return (
              <li key={notice.id}>
                <Link
                  href={`/notices/${notice.id}`}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 transition-colors"
                >
                  <span className={`px-1.5 py-0.5 text-xs rounded ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <span className="flex-grow text-sm text-gray-800 truncate hover:text-amber-700">
                    {notice.title}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(notice.createdAt)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
