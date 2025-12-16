import { PageLayout } from "@/components/layout"
import Link from "next/link"

export const metadata = {
  title: "새소식 - 바람의 나라",
  description: "바람의나라 게임 업데이트 및 새소식",
}

interface NewsItem {
  id: number
  title: string
  date: string
  summary: string
  content: string[]
  source: string
  sourceUrl: string
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "2024년 하반기 업데이트 계획 안내",
    date: "2024-11-14",
    summary: "환골탈태2 대규모 업데이트가 3단계로 나누어 진행됩니다.",
    content: [
      "1차 (24년 12월): 마법 리밸런싱, 탐험일지 개편, 7차 지역 추가",
      "2차 (25년 1월): 신규 강화 시스템, 8차 인도 지역 콘텐츠",
      "3차 (25년 2월): 인도 후반 지역, 860레벨 사냥터 추가",
      "지역 콘텐츠 확대: 지역 스토리 퀘스트, 필드 탐험 요소와 희귀 괴수, 필드 보스 등 추가",
      "탐험일지 개편: 탐험과 사냥 기록 분리, 동일 서버 캐릭터 간 공유",
      "전 직업 마법 리밸런싱: 승급 시점별 신규 마법, PvE/PvP 마법 분리",
      "신규 강화 시스템: 짧은 주기로 성장을 경험하며 전투의 재미를 높이는 시스템 도입",
    ],
    source: "바람의나라 공식",
    sourceUrl: "https://baram.nexon.com/Notice/List/1/145035",
  },
  {
    id: 2,
    title: "1월 9일(목) 환골탈태2 - 2차 업데이트",
    date: "2025-01-09",
    summary: "인도 지역 확대, 성좌 시스템 추가, 마법 태그 시스템 등 대규모 업데이트",
    content: [
      "인도 지역 확대: 마하칼리의신전, 벵골깊은숲 등 신규 지역 추가",
      "새로운 보스 여신마하칼리 등장 (영웅급 장비재련 재료 보상)",
      "인도 지역 호박 획득량 상향",
      "성좌 시스템 신규 추가: 7차 승급 이상 캐릭터로 넥슨ID 당 1회 입문 임무 완료 필요",
      "마법 태그 시스템 추가",
      "바람의원석 100개로 월정석 1개 교환 가능",
      "타격/마력 흡수 상한 능력치 추가",
      "재생효과 개편: 기본 회복 주기를 10초로 통일",
    ],
    source: "바람의나라 공식",
    sourceUrl: "https://baram.nexon.com/Notice/List/1/145984",
  },
  {
    id: 3,
    title: "1월 23일(목) 업데이트 내용 안내",
    date: "2025-01-23",
    summary: "마법 시스템 버그 수정, 장비 재련 보관함 확장, 설날 이벤트 시작",
    content: [
      "대련 중 성좌 효과 미적용 버그 수정",
      "영술사 도깨비탈출 후 이동 버그 해결",
      "요괴질주 사용 시 다른 이속 증가 효과가 해제되지 않도록 개선",
      "장비 재련 보관함 최대 보유 개수 9,999개 → 10만개로 확장",
      "물품배송함 등급별 정렬 기능 추가",
      "설날육성패키지 판매 (1/23~1/29)",
      "설행운복주머니 판매 (1/23~2/6)",
      "설날 이벤트 패키지 복주머니 판매 (1/23~2/5)",
    ],
    source: "바람의나라 공식",
    sourceUrl: "https://baram.nexon.com/Notice/List/1/146094",
  },
]

export default function NewsPage() {
  return (
    <PageLayout>
      {/* 헤더 */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-2">새소식</h1>
        <p className="text-amber-100">바람의나라 최신 업데이트 및 이벤트 소식</p>
      </section>

      {/* 뉴스 목록 */}
      <div className="space-y-6">
        {newsData.map((news) => (
          <article
            key={news.id}
            className="bg-white rounded-lg border border-amber-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-bold text-amber-900 flex-1">
                  {news.title}
                </h2>
                <time className="text-sm text-amber-500 ml-4 whitespace-nowrap">
                  {news.date}
                </time>
              </div>

              {/* 요약 */}
              <p className="text-amber-700 mb-4">{news.summary}</p>

              {/* 상세 내용 */}
              <div className="bg-amber-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-amber-800 mb-2 text-sm">주요 내용</h3>
                <ul className="space-y-1">
                  {news.content.map((item, index) => (
                    <li key={index} className="text-sm text-amber-700 flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 출처 */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-500">출처: {news.source}</span>
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-800 hover:underline"
                >
                  원문 보기 →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 더보기 링크 */}
      <div className="mt-8 text-center">
        <a
          href="https://baram.nexon.com/Notice/List?noticeCode=5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          공식 홈페이지에서 더 많은 소식 보기
        </a>
      </div>

      {/* 안내 */}
      <p className="mt-4 text-center text-sm text-amber-500">
        * 본 페이지의 정보는 넥슨 바람의나라 공식 홈페이지에서 발췌되었습니다.
      </p>
    </PageLayout>
  )
}
