import { PageLayout } from "@/components/layout"
import Image from "next/image"

export const metadata = {
  title: "바람소개 - 바람의 나라",
  description: "세계 최장수 MMORPG 바람의나라 게임 소개",
}

export default function AboutPage() {
  return (
    <PageLayout>
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-4">바람의 나라</h1>
        <p className="text-lg text-amber-700 mb-2">The Kingdom of the Winds</p>
        <p className="text-amber-600">세계 최장수 MMORPG | 1996년 서비스 시작</p>
      </section>

      {/* 게임 소개 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🏰</span> 게임 소개
        </h2>
        <div className="space-y-4 text-amber-800">
          <p>
            <strong>바람의나라</strong>는 김진 작가의 동명 만화를 원작으로 넥슨이 개발한
            대한민국 최초의 상용 그래픽 MMORPG입니다. 고구려 2대 왕인 유리왕의 아들
            대무신왕 무휼의 정벌담과, 호동 왕자와 낙랑 공주의 사랑 이야기를 배경으로 합니다.
          </p>
          <p>
            1996년 4월 5일 정식 서비스를 시작하여, 현재까지 28년 이상 서비스를 이어오고 있는
            세계에서 가장 오래된 상용 MMORPG입니다.
          </p>
        </div>
      </section>

      {/* 주요 기록 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🏆</span> 주요 기록
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">2,100만+</div>
            <div className="text-sm text-amber-700">누적 회원 수</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">13만명</div>
            <div className="text-sm text-amber-700">최고 동시접속자</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">2011년</div>
            <div className="text-sm text-amber-700">기네스북 등재</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">28년+</div>
            <div className="text-sm text-amber-700">서비스 기간</div>
          </div>
        </div>
      </section>

      {/* 역사 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>📜</span> 역사
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">1994</div>
            <div className="text-amber-800">게임 기획 시작. 김정주 넥슨 창업자가 직접 개발에 참여</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">1995</div>
            <div className="text-amber-800">12월 25일 베타테스트 실시</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">1996</div>
            <div className="text-amber-800">4월 5일 정식 서비스 시작</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">1998</div>
            <div className="text-amber-800">연 매출 100억 원 달성</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">1999</div>
            <div className="text-amber-800">한국 온라인 게임 최초 해외 진출 (미국, 프랑스)</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">2000</div>
            <div className="text-amber-800">일본 서비스 시작</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">2011</div>
            <div className="text-amber-800">기네스북 등재 - &quot;세계에서 가장 오래 서비스 중인 MMORPG&quot;</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">2014</div>
            <div className="text-amber-800">넥슨컴퓨터박물관에서 1996년 버전 복원</div>
          </div>
        </div>
      </section>

      {/* 게임 특징 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>⚔️</span> 게임 특징
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">다양한 직업</h3>
            <p className="text-sm text-amber-700">
              전사, 도적, 주술사, 도사 등 9개의 직업을 선택할 수 있습니다.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">승급 시스템</h3>
            <p className="text-sm text-amber-700">
              레벨 99 달성 후 승급을 통해 체력과 마력을 강화할 수 있습니다.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">커뮤니티</h3>
            <p className="text-sm text-amber-700">
              문파, 결혼, 친구 시스템 등 풍부한 소셜 기능을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 원작 소개 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>📚</span> 원작 소개
        </h2>
        <div className="text-amber-800 space-y-4">
          <p>
            <strong>바람의나라</strong>는 김진 작가가 1992년부터 연재한 역사 판타지 만화입니다.
            기원 후 18년에서 23년 사이 동아시아를 배경으로, 고구려의 역사와 신화를
            바탕으로 한 웅장한 서사를 담고 있습니다.
          </p>
          <p>
            주인공 무휼(대무신왕)의 성장과 정복, 그리고 호동 왕자와 낙랑 공주의
            비극적인 사랑 이야기가 중첩되어 펼쳐집니다.
          </p>
        </div>
      </section>

      {/* 관련 링크 */}
      <section className="bg-amber-100 rounded-lg p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🔗</span> 관련 링크
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://baram.nexon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            공식 홈페이지
          </a>
          <a
            href="https://namu.wiki/w/바람의%20나라(게임)"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded hover:bg-amber-50 transition-colors"
          >
            나무위키
          </a>
          <a
            href="https://computermuseum.nexon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded hover:bg-amber-50 transition-colors"
          >
            넥슨컴퓨터박물관
          </a>
        </div>
      </section>
    </PageLayout>
  )
}
