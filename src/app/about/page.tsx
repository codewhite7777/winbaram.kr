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
      <section className="relative bg-gradient-to-b from-amber-900 to-amber-800 rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://lwi.nexon.com/baram/2020/0723_intro_286F3CA21F06734D/img_screenshot_intro.png"
            alt="바람의나라 게임 화면"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative z-10 p-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">바람의 나라</h1>
          <p className="text-xl mb-2 drop-shadow">The Kingdom of the Winds</p>
          <p className="text-amber-200">세계 최장수 MMORPG | 1996년 서비스 시작</p>
          <div className="mt-4 inline-block bg-amber-600/80 px-4 py-2 rounded-full text-sm">
            기네스북 등재 - 세계에서 가장 오래 서비스 중인 MMORPG
          </div>
        </div>
      </section>

      {/* 구버전 게임 스크린샷 갤러리 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🎮</span> 구버전 게임 화면 (4.65 / 5.50)
        </h2>
        <p className="text-sm text-amber-600 mb-4">
          2003년 이전 구버전 바람의나라의 추억의 게임 화면입니다.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/1.png"
              alt="바람의나라 구버전 화면 1"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              구버전 마을 풍경
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/2.png"
              alt="바람의나라 구버전 화면 2"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              5.50 버전 플레이
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/3.png"
              alt="바람의나라 구버전 화면 3"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              구버전 사냥터
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/4.png"
              alt="바람의나라 구버전 화면 4"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              추억의 인터페이스
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/5.png"
              alt="바람의나라 구버전 화면 5"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              4.65 버전 그래픽
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Image
              src="https://baramhyangky.com/img/slider/6.png"
              alt="바람의나라 구버전 화면 6"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">
              클래식 바람의나라
            </div>
          </div>
        </div>
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
            세계에서 가장 오래된 상용 MMORPG입니다. 엔씨소프트의 리니지, 엠게임의 다크세이버와
            함께 대한민국 1세대 온라인 게임으로 불립니다.
          </p>
        </div>
      </section>

      {/* 주요 기록 */}
      <section className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🏆</span> 주요 기록
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-amber-600">2,100만+</div>
            <div className="text-xs md:text-sm text-amber-700 mt-1">누적 회원 수</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-amber-600">13만명</div>
            <div className="text-xs md:text-sm text-amber-700 mt-1">최고 동시접속자</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-amber-600">2011년</div>
            <div className="text-xs md:text-sm text-amber-700 mt-1">기네스북 등재</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-amber-600">28년+</div>
            <div className="text-xs md:text-sm text-amber-700 mt-1">서비스 기간</div>
          </div>
        </div>
      </section>

      {/* 역사 타임라인 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>📜</span> 역사
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-200"></div>
          <div className="space-y-4">
            {[
              { year: "1994", event: "게임 기획 시작. 김정주 넥슨 창업자가 직접 개발에 참여" },
              { year: "1995", event: "12월 25일 베타테스트 실시 (PC통신 천리안)" },
              { year: "1996", event: "4월 5일 정식 서비스 시작 (680x480, 256컬러)" },
              { year: "1998", event: "연 매출 100억 원 달성" },
              { year: "1999", event: "한국 온라인 게임 최초 해외 진출 (미국, 프랑스)" },
              { year: "2000", event: "일본 서비스 시작, 4.80버전 국내성/부여성 복원" },
              { year: "2005", event: "궁사 직업 추가" },
              { year: "2011", event: "기네스북 등재 - \"세계에서 가장 오래 서비스 중인 MMORPG\"" },
              { year: "2014", event: "넥슨컴퓨터박물관에서 1996년 버전 완전 복원" },
              { year: "2020", event: "클래식 그래픽 모드 & 와이드 해상도 업데이트" },
            ].map((item, index) => (
              <div key={index} className="relative pl-10">
                <div className="absolute left-2 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="font-bold text-amber-600 text-sm md:text-base md:w-16">{item.year}</span>
                  <span className="text-amber-800 text-sm md:text-base">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 그래픽 세대 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>🎨</span> 그래픽 세대
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
            <h3 className="font-bold text-amber-900 mb-2">1세대 (1996~)</h3>
            <p className="text-sm text-amber-700">
              초창기 바람의나라. 680x480 해상도, 256컬러.
              텍스트 머드 기반 명령어 조작 방식.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
            <h3 className="font-bold text-amber-900 mb-2">2세대 (구버전)</h3>
            <p className="text-sm text-amber-700">
              4.65, 5.50 버전 등. 캐릭터 외형 유지,
              인터페이스와 이펙트 개선.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
            <h3 className="font-bold text-amber-900 mb-2">3세대 (신버전)</h3>
            <p className="text-sm text-amber-700">
              현재의 바람의나라. 고해상도 지원,
              클래식 그래픽 모드 선택 가능.
            </p>
          </div>
        </div>
      </section>

      {/* 게임 특징 */}
      <section className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>⚔️</span> 게임 특징
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">10개의 직업</h3>
            <p className="text-sm text-amber-700 mb-2">
              전사, 도적, 주술사, 도사, 궁사, 천인, 마도사, 영술사, 차사, 살수
            </p>
            <p className="text-xs text-amber-600">
              격수(전사,도적,궁사,차사,살수) / 비격수(주술사,도사,마도사,영술사)
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">승급 시스템</h3>
            <p className="text-sm text-amber-700">
              레벨 99 달성 후 승급을 통해 경험치를 체력/마력으로 환원.
              최대 799레벨까지 성장 가능.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">두 나라 체제</h3>
            <p className="text-sm text-amber-700">
              고구려(국내성)와 부여(부여성) 중 선택.
              각 나라별 고유 던전과 사냥터 존재.
            </p>
          </div>
          <div className="border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2">커뮤니티</h3>
            <p className="text-sm text-amber-700">
              문파(길드), 결혼, 친구 시스템 등
              풍부한 소셜 기능 제공.
            </p>
          </div>
        </div>
      </section>

      {/* 원작 소개 */}
      <section className="bg-amber-50 rounded-lg border border-amber-200 p-6 mb-6">
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
            href="https://baram.nexon.com/Download/Contents"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
          >
            게임 다운로드
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
