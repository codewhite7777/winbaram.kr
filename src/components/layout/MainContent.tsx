import Link from 'next/link'

type Notice = {
  id: string
  title: string
  type: string
  isPinned: boolean
  createdAt: string
}

type MainContentProps = {
  notices?: Notice[]
}

const typeLabels: Record<string, string> = {
  NOTICE: '공지',
  EVENT: '이벤트',
  UPDATE: '업데이트',
  MAINTENANCE: '점검',
}

// 샘플 바람 이야기 데이터
const stories = [
  { id: 1, episode: '1회', title: '핑크빛의 핑크빛 이야기~' },
]

// 샘플 유저 글
const userPosts = [
  { id: 1, author: '꼬마야', title: '이것봐... 꼬마야...' },
  { id: 2, author: '팔명', title: '안녕하세요, 연서버 글작가 아저씨(팔명)입니다.' },
]

// 샘플 노하우 글
const tips = [
  { id: 1, title: '[공략] 용궁 던전 좌표 공개!!', author: '초록명' },
]

export function MainContent({ notices = [] }: MainContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 3) {
      return { date: date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }), isNew: true }
    }
    return { date: date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }), isNew: false }
  }
  return (
    <main className="flex-1 bg-amber-50/50 p-4 space-y-4">
      {/* 공지사항/이벤트 */}
      <section className="bg-white rounded border border-amber-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1">
            <span>📋</span> 공지 및 이벤트
          </h2>
          <Link href="/notices" className="text-xs text-blue-600 hover:underline">
            더보기 &gt;
          </Link>
        </div>
        <ul className="space-y-1">
          {notices.map((notice) => {
            const { date, isNew } = formatDate(notice.createdAt)
            return (
              <li key={notice.id} className="flex items-center gap-2 text-sm">
                {isNew && (
                  <span className="text-xs text-red-500 font-bold">NEW!</span>
                )}
                <span className="text-xs px-1 bg-amber-100 text-amber-700 rounded">
                  {typeLabels[notice.type] || notice.type}
                </span>
                <Link href={`/notices/${notice.id}`} className="text-amber-900 hover:text-blue-600 truncate flex-1">
                  {notice.title}
                </Link>
                <span className="text-xs text-amber-500">{date}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 바람 이야기 */}
      <section className="bg-white rounded border border-amber-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1">
            <span>📖</span> 바람 이야기
          </h2>
          <Link href="/stories" className="text-xs text-blue-600 hover:underline">
            더보기 &gt;
          </Link>
        </div>
        <ul className="space-y-1">
          {stories.map((story) => (
            <li key={story.id} className="text-sm">
              <Link href={`/story/${story.id}`} className="text-amber-900 hover:text-blue-600">
                [{story.episode}] {story.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 유저들의 글모음 */}
      <section className="bg-white rounded border border-amber-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1">
            <span>✍️</span> 유저들의 글모음
          </h2>
          <Link href="/community" className="text-xs text-blue-600 hover:underline">
            더보기 &gt;
          </Link>
        </div>
        <ul className="space-y-1">
          {userPosts.map((post) => (
            <li key={post.id} className="text-sm">
              <Link href={`/post/${post.id}`} className="text-amber-900 hover:text-blue-600">
                {post.title}
              </Link>
              <span className="text-xs text-amber-500 ml-2">- {post.author}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 나만의 바람 노하우 */}
      <section className="bg-white rounded border border-amber-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1">
            <span>💡</span> 나만의 바람 노하우
          </h2>
          <Link href="/tips" className="text-xs text-blue-600 hover:underline">
            더보기 &gt;
          </Link>
        </div>
        <ul className="space-y-1">
          {tips.map((tip) => (
            <li key={tip.id} className="text-sm">
              <Link href={`/tip/${tip.id}`} className="text-amber-900 hover:text-blue-600">
                {tip.title}
              </Link>
              <span className="text-xs text-amber-500 ml-2">- {tip.author}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
