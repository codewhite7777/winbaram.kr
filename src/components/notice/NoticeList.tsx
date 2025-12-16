"use client"

import Link from "next/link"

type Notice = {
  id: string
  title: string
  type: string
  isPinned: boolean
  createdAt: string
  startDate: string | null
  endDate: string | null
}

type NoticeListProps = {
  notices: Notice[]
  showWriteButton?: boolean
}

const typeLabels: Record<string, { label: string; color: string }> = {
  NOTICE: { label: "공지", color: "bg-blue-100 text-blue-700" },
  EVENT: { label: "이벤트", color: "bg-green-100 text-green-700" },
  UPDATE: { label: "업데이트", color: "bg-purple-100 text-purple-700" },
  MAINTENANCE: { label: "점검", color: "bg-red-100 text-red-700" },
}

export function NoticeList({ notices, showWriteButton = false }: NoticeListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatPeriod = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null
    if (startDate && endDate) {
      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`
    }
    if (startDate) return `${formatDate(startDate)} ~`
    if (endDate) return `~ ${formatDate(endDate)}`
    return null
  }

  return (
    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex justify-between items-center">
        <h2 className="font-bold text-amber-900">공지사항</h2>
        {showWriteButton && (
          <Link
            href="/notices/write"
            className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            글쓰기
          </Link>
        )}
      </div>

      {/* List */}
      {notices.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          공지사항이 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-amber-100">
          {notices.map((notice) => {
            const typeInfo = typeLabels[notice.type] || typeLabels.NOTICE
            const period = formatPeriod(notice.startDate, notice.endDate)

            return (
              <li key={notice.id}>
                <Link
                  href={`/notices/${notice.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors"
                >
                  {/* Type Badge */}
                  <span className={`px-2 py-0.5 text-xs rounded ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>

                  {/* Pinned Icon */}
                  {notice.isPinned && (
                    <span className="text-amber-500" title="고정됨">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5zm8 0H7v2h6V5zM3 14a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3z" />
                      </svg>
                    </span>
                  )}

                  {/* Title */}
                  <span className="flex-grow text-gray-900 hover:text-amber-700 truncate">
                    {notice.title}
                  </span>

                  {/* Period or Date */}
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {period || formatDate(notice.createdAt)}
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
