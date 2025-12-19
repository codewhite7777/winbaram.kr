import { PageLayout } from "@/components/layout"

export const metadata = {
  title: "새소식 - 바람의 나라",
  description: "바람의나라 역사와 주요 이벤트",
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
    title: "바람의나라 정식 서비스 시작",
    date: "1996-04-05",
    summary: "넥슨의 첫 번째 온라인 게임 '바람의나라'가 PC통신 천리안에서 정식 서비스를 시작했습니다.",
    content: [
      "김진 작가의 동명 만화 '바람의 나라'를 원작으로 개발",
      "1994년 12월 기획 시작, 1995년 12월 25일 베타테스트 실시",
      "PC통신 천리안을 통해 서비스 시작 (분당 요금제)",
      "1996년 5월 유니텔 상용화, 10월 윈도우 2.0 버전 출시",
      "1996년 11월 정액제 과금 도입 (월 4만원)",
      "초기에는 월 수익 100만원에 불과했으나, 빠르게 성장",
      "메리디안 59(1996년 9월)보다 먼저 상용화된 그래픽 MMORPG",
    ],
    source: "넥슨컴퓨터박물관",
    sourceUrl: "https://computermuseum.nexon.com/news/detail?id=312",
  },
  {
    id: 2,
    title: "바람의나라 해외 진출 - Nexus: The Kingdom of the Winds",
    date: "1997-10-01",
    summary: "국산 온라인 게임 최초로 해외(미국) 서비스를 시작했습니다.",
    content: [
      "영문판 'Nexus: The Kingdom of the Winds'로 미국 베타서비스 시작",
      "1998년 7월 미국 현지 정식 상용화",
      "대한민국 온라인 게임 중 처음으로 해외 진출",
      "1997년 1월 인터넷 상용화, 3월 나우누리 상용화",
      "같은 해 온라인 게임 최초 부부 탄생 (김종민, 전성아 커플)",
      "백화검 출시, 무한대전장 개장 등 콘텐츠 확대",
      "한국 온라인 게임 해외 진출의 시초가 됨",
    ],
    source: "나무위키",
    sourceUrl: "https://namu.wiki/w/바람의%20나라(게임)/역사",
  },
  {
    id: 3,
    title: "바람의나라 4.0 대규모 업데이트",
    date: "1998-12-08",
    summary: "인터페이스, 지역, NPC 등이 대대적으로 변경되어 현재까지 기억되는 바람의나라의 모습이 정립되었습니다.",
    content: [
      "마우스 조작 지원 추가 (기존 키보드 전용에서 변경)",
      "새로운 직업 '도사' 추가",
      "승급 시스템 도입",
      "신규 인터페이스 적용",
      "지역 및 NPC 대대적 변경",
      "신수 마법 이펙트 추가",
      "이후 많은 유저들이 기억하는 '바람의나라'의 기반이 됨",
      "1998년 2월 문화체육부-전자신문사 '이달의 우수게임' 선정",
      "1998년 연 매출 100억원 달성",
    ],
    source: "나무위키",
    sourceUrl: "https://namu.wiki/w/바람의%20나라(게임)/역사",
  },
]

export default function NewsPage() {
  return (
    <PageLayout>
      {/* 헤더 */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-2">새소식</h1>
        <p className="text-amber-100">바람의나라 초창기 역사와 주요 이벤트 (1996~1998)</p>
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
          href="https://namu.wiki/w/바람의%20나라(게임)/역사"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          바람의나라 전체 역사 보기
        </a>
      </div>

      {/* 안내 */}
      <p className="mt-4 text-center text-sm text-amber-500">
        * 본 페이지의 정보는 넥슨컴퓨터박물관, 나무위키 등에서 발췌되었습니다.
      </p>
    </PageLayout>
  )
}
