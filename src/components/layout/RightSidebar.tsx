import Link from 'next/link'

export function RightSidebar() {
  return (
    <aside className="w-52 bg-amber-50 border-l border-amber-200">
      {/* 베스트 스크린샷 */}
      <section className="p-3 border-b border-amber-200">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1">
          <span>📸</span> 베스트 스크린샷
        </h3>
        <div className="bg-amber-100 h-24 rounded flex items-center justify-center text-xs text-amber-500">
          스크린샷 이미지
        </div>
        <Link
          href="/screenshots"
          className="block text-xs text-blue-600 hover:underline mt-1 text-right"
        >
          자세히 보기 &gt;
        </Link>
      </section>

      {/* 오늘의 운세 */}
      <section className="p-3 border-b border-amber-200">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1">
          <span>🔮</span> 오늘의 운세
        </h3>
        <p className="text-xs text-amber-700">
          동쪽으로 가면 귀인을...
        </p>
        <Link
          href="/fortune"
          className="block text-xs text-blue-600 hover:underline mt-1 text-right"
        >
          자세히 보기 &gt;
        </Link>
      </section>

      {/* 잠깐투표 */}
      <section className="p-3 border-b border-amber-200">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1">
          <span>🗳️</span> 잠깐투표
        </h3>
        <p className="text-xs text-amber-700 mb-2">
          넥슨클럽을 이용한 비밀번호에 대해 어떻게 생각하십니까?
        </p>
        <div className="space-y-1 text-xs">
          <label className="flex items-center gap-1">
            <input type="radio" name="poll" className="text-amber-600" />
            <span>편리하다</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="poll" className="text-amber-600" />
            <span>불편하다</span>
          </label>
        </div>
        <div className="flex gap-1 mt-2">
          <button className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700">
            투표
          </button>
          <button className="px-2 py-1 text-xs border border-amber-400 text-amber-700 rounded hover:bg-amber-100">
            결과보기
          </button>
        </div>
      </section>

      {/* 바람순위리스트 */}
      <section className="p-3">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1">
          <span>🏆</span> 바람순위리스트
        </h3>
        <p className="text-xs text-amber-700">
          과연 난 몇위일까?
        </p>
        <Link
          href="/ranking"
          className="block text-xs text-blue-600 hover:underline mt-1"
        >
          순위 확인하기 &gt;
        </Link>
      </section>
    </aside>
  )
}
