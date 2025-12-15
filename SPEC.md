# Winbaram.kr 프로젝트 명세서

## 프로젝트 개요

- **프로젝트명**: Winbaram.kr
- **목적**: MMORPG 게임 커뮤니티 및 운영 사이트 (바람의 나라)
- **개발 방법론**: Spec-Driven Development + TDD
- **작성일**: 2025-12-10

---

## 기술 스택

### Frontend
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4

### Backend
- **런타임**: Node.js (Next.js API Routes)
- **ORM**: Prisma
- **데이터베이스**: PostgreSQL

### Testing
- **단위/통합 테스트**: Vitest + Testing Library
- **테스트 방법론**: TDD (Test-Driven Development)

### Authentication
- **방식**: OAuth 소셜 로그인 (Google, Discord 등)

---

## 레이아웃 구조 (참고 스크린샷 기반)

참고 이미지: `assets/reference-screenshot.png`

```
+------------------------------------------------------------------+
|                           HEADER                                  |
|  [로고: 바람의 나라]  [캐릭터 이미지]  [로그인/회원가입 영역]        |
+------------------------------------------------------------------+
|         |                                    |                    |
|  LEFT   |           MAIN CONTENT             |       RIGHT        |
| SIDEBAR |                                    |      SIDEBAR       |
|         |                                    |                    |
| - 바람소개 |  +--공지사항/이벤트 목록--------+  | - 베스트 스크린샷  |
| - 바람하기 |  |  NEW! [이벤트] 제목... 날짜  |  | - 투표하기        |
| - 새소식   |  |  NEW! [공지] 제목... 날짜   |  | - 오늘의 운세     |
| - 자료실   |  +-----------------------------+  | - 옛친구를 찾아요 |
| - 바람웹진 |                                    | - 잠깐투표        |
| - 질문과답 |  +--바람 이야기-----------------+  | - 바람순위리스트  |
|           |  |  유저 스토리/글              |  |                   |
| [이메일   |  +-----------------------------+  |                   |
|  구독신청]|                                    |                   |
|           |  +--유저들의 글모음---------------+  |                   |
| [광고     |  |  커뮤니티 게시글 미리보기    |  |                   |
|  배너들]  |  +-----------------------------+  |                   |
|           |                                    |                   |
|           |  +--나만의 바람 노하우-----------+  |                   |
|           |  |  팁/공략 게시글              |  |                   |
|           |  +-----------------------------+  |                   |
+-----------+------------------------------------+-------------------+
|                           FOOTER                                  |
+------------------------------------------------------------------+
```

### 색상 팔레트 (레트로 스타일)
- **배경**: 양피지/파피루스 텍스처 (베이지 계열)
- **헤더 배경**: 황금/갈색 그라데이션
- **메뉴 버튼**: 나무 텍스처 스타일
- **텍스트**: 어두운 갈색 (#333)
- **링크**: 파란색 (#0066CC)
- **강조**: 빨간색 (NEW 뱃지)

### 주요 UI 컴포넌트
1. **헤더**: 로고 + 캐릭터 일러스트 + 로그인 영역
2. **좌측 사이드바**: 메인 네비게이션 메뉴 + 이메일 구독 + 광고
3. **중앙 콘텐츠**: 공지/이벤트 + 유저 콘텐츠 섹션들
4. **우측 사이드바**: 위젯들 (베스트 스크린샷, 투표, 랭킹 등)

---

## 핵심 기능 요구사항

### 1. 사용자 시스템
- [ ] OAuth 소셜 로그인 (Google, Discord)
- [ ] 사용자 프로필 관리
- [ ] 권한/등급 시스템 (USER, MODERATOR, ADMIN, SUPER_ADMIN)

### 2. 관리자 대시보드
- [ ] 사용자 관리
- [ ] 콘텐츠 관리
- [ ] 사이트 설정
- [ ] 통계 및 분석

### 3. 게임 공지사항/이벤트
- [ ] 공지사항 CRUD
- [ ] 이벤트 관리 (시작일/종료일)
- [ ] 업데이트 노트
- [ ] 점검 공지

### 4. 랭킹/통계
- [ ] 레벨 랭킹
- [ ] PVP 랭킹
- [ ] 길드 랭킹
- [ ] 재화 랭킹

### 5. 게임 서버 상태 모니터링
- [ ] 서버 상태 실시간 표시 (ONLINE/OFFLINE/MAINTENANCE)
- [ ] 접속자 수 표시
- [ ] 서버 점검 알림

### 6. 커뮤니티 게시판
- [ ] 카테고리별 게시판
- [ ] 유저 게시글 작성/수정/삭제
- [ ] 댓글/대댓글 시스템
- [ ] 게시글 검색

---

## 데이터베이스 스키마

### 주요 테이블
- `users`: 사용자 정보
- `accounts`: OAuth 계정 연동
- `categories`: 게시판 카테고리
- `posts`: 게시글
- `comments`: 댓글
- `notices`: 공지사항/이벤트
- `server_status`: 게임 서버 상태
- `rankings`: 랭킹 데이터

상세 스키마: `prisma/schema.prisma` 참조

---

## 개발 원칙

1. **TDD 적용**: 모든 기능은 테스트 코드를 먼저 작성한 후 구현
2. **Spec-Driven**: 기능 구현 전 명세를 먼저 문서화
3. **타입 안전성**: TypeScript 엄격 모드 사용
4. **코드 품질**: ESLint, Prettier 적용

---

## 디렉토리 구조

```
winbaram.kr/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # 메인 레이아웃 그룹
│   │   ├── admin/             # 관리자 페이지
│   │   └── api/               # API 라우트
│   ├── components/            # React 컴포넌트
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── ui/                # UI 컴포넌트
│   │   └── features/          # 기능별 컴포넌트
│   ├── lib/                   # 유틸리티 함수
│   ├── hooks/                 # Custom React Hooks
│   ├── types/                 # TypeScript 타입 정의
│   ├── test/                  # 테스트 설정
│   └── generated/             # Prisma 생성 파일
├── prisma/
│   └── schema.prisma          # 데이터베이스 스키마
├── assets/                    # 참고 자료
│   └── reference-screenshot.png
├── public/                    # 정적 파일
└── SPEC.md                    # 프로젝트 명세서
```

---

## 변경 이력

| 날짜 | 변경 내용 | 비고 |
|------|----------|------|
| 2025-12-10 | 초기 명세서 작성 | 프로젝트 시작 |
| 2025-12-10 | 레이아웃 구조 분석 추가 | 참고 스크린샷 기반 |
| 2025-12-10 | 데이터베이스 스키마 설계 | Prisma 스키마 작성 |
| 2025-12-10 | 레이아웃 컴포넌트 구현 | Header, Sidebar, Footer, MainContent |
| 2025-12-10 | OAuth 인증 시스템 구현 | NextAuth.js v5, Google/Discord 지원 |

---

## 인증 시스템 (OAuth)

### 설정 완료
- **라이브러리**: NextAuth.js v5 (Auth.js)
- **지원 프로바이더**: Google, Discord
- **세션 저장**: Prisma Adapter (PostgreSQL)

### OAuth 설정 방법

1. **Google OAuth**
   - https://console.cloud.google.com/apis/credentials 에서 OAuth 2.0 클라이언트 생성
   - 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
   - `.env.local`에 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 설정

2. **Discord OAuth**
   - https://discord.com/developers/applications 에서 애플리케이션 생성
   - OAuth2 > Redirects: `http://localhost:3000/api/auth/callback/discord`
   - `.env.local`에 `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` 설정

### 환경 변수 설정
참고: `.env.example` 파일

---

## 미결 사항 (TBD)

- [x] 참고 스크린샷 확인 - 완료 (assets/reference-screenshot.png)
- [x] OAuth 제공자 최종 선정 - Google, Discord
- [ ] 데이터베이스 호스팅 방식 결정
- [ ] 배포 환경 결정 (Vercel, AWS 등)
- [ ] 이미지/에셋 리소스 확보 (로고, 캐릭터 이미지 등)
- [ ] Google/Discord OAuth 앱 생성 및 키 발급
