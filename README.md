# Hy-Link (하이링크) 🍊
> **SK하이닉스 260928 신입 구성원 One Team 크로스 네트워킹 플랫폼**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 1. 프로젝트 배경 및 기획 의도 (Background)

- **대상 타겟**: 2026년 9월 28일 입사한 SK하이닉스 신입 구성원 300명
- **핵심 문제 의식**:
  - 입사 후 2주간의 집체 교육 기간 동안 배정된 조원(6명) 외 300명 동기들과는 교류할 기회가 매우 부족함.
  - 10월 14일 각 현업 부서로 흩어지면 사일로(Silo)가 생겨 서로 다른 직무/캠퍼스 동기들과 친해지기 어려워짐.
  - 향후 현업에서 마주할 고민과 성장을 함께 나눌 친구, 같은 취미(테니스, 러닝, 헬스 등)를 즐길 동기를 찾을 수 있는 채널 필요.
- **핵심 철학**:
  - 복잡한 기능보다는 **초간결 4단계 매칭 설문, 익명/비공개 안심 프로필, 소모임 번개, 카카오톡 오픈채팅 연동**에 집중하여 직관적이고 안전한 네트워크 형성 지원.

---

## 🚀 2. 주요 기능 (Features)

1. **사내 간편 온보딩 & 개인정보 보호 동의**
   - 260928 입사 기수 확인 및 개인정보 이용동의 절차
   - 전화번호/카카오 인증 친화적 설계
2. **마이페이지 & 안심 프로필 관리**
   - 부서('10/14 부서배치 예정') 및 입사연차('1년차') 기본 잠금
   - 사진 업로드 / SK하이닉스 마스코트 아바타(하루, 하빔이 등) 선택 지원
   - 모든 프로필 정보의 **선택적 비공개(Private) 토글** 지원
   - MBTI & 관심 키워드 해시태그 등록
3. **4단계 1:1 매칭 신청서**
   - 1단계: 만남 목적 (타부서 업무 교류 / 취미·운동 메이트 / 점심·기숙사 메이트)
   - 2단계: 선호 동료 (서로 다른 부서 / 비슷한 직무 / 나이대 비슷한 또래)
   - 3단계: 관심사 & 세부 취미 (러닝, 테니스, 헬스, 맛집 등 멀티 셀렉트)
   - 4단계: 만남 형태 (1:1 / 평일 점심 / 주말 사외 활동)
4. **동기 매칭 모집 현황 & 사전 안전 대기**
   - 현재 300명 신입 기수 사전 모집 진행 중 안내
   - 50명 이상 모집 완료 시 관리자 승인을 통해 1:1 매칭 피드 활성화
5. **동기 소모임 & 번개 모임 (Gatherings)**
   - 주말 러닝, 퇴근 후 헬스/테니스, 주말 맛집 탐방 등 자유로운 소모임 개설 및 참여
   - 실시간 인원 현황 및 직관적인 태그 검색
6. **카카오톡 오픈채팅 1:1 연동**
   - 매칭된 동기와 안전하게 대화를 시작할 수 있는 오픈채팅방 링크 공유 및 바로가기 지원
7. **PWA (Progressive Web App) 모바일 홈 화면 지원**
   - 모바일 브라우저 '홈 화면에 추가' 시 앱과 동일한 네이티브 경험 제공

---

## 🛠️ 3. 기술 스택 (Tech Stack)

| 구분 | 기술 |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion |
| **Backend** | Node.js, Express, tsx |
| **PWA** | Web App Manifest, Mobile Viewport meta tags, SVG & PNG App Icons |
| **Design** | SK Hynix Signature Coral Orange Theme (`#FF6B35`) |

---

## 💻 4. 시작 가이드 (Quick Start)

### 사전 요구사항
- Node.js 20.x 이상
- npm 또는 bun / pnpm

### 설치 및 로컬 실행
```bash
# 1. 저장소 클론 (Clone)
git clone https://github.com/your-username/hy-link.git
cd hy-link

# 2. 의존성 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:3000 접속

# 4. 프로덕션 빌드
npm run build
```

---

## 📂 5. 프로젝트 구조 (Directory Structure)

```
hy-link/
├── public/                 # PWA 정적 자산 (아이콘, 매니페스트)
│   ├── icon-180.png        # iOS 홈화면 터치 아이콘
│   ├── icon-192.png        # 안드로이드 PWA 아이콘
│   ├── icon-512.png        # 고해상도 스플래시 아이콘
│   ├── icon.svg            # 벡터 로고 아이콘
│   └── manifest.json       # Web App Manifest 설정
├── src/
│   ├── components/         # 리액트 UI 컴포넌트
│   │   ├── ApplicationSurveyView.tsx  # 4단계 매칭 신청서
│   │   ├── GatheringTab.tsx           # 동기 소모임/번개 탭
│   │   ├── LoginPage.tsx              # 사내 간편 로그인 & 이용동의
│   │   ├── MatchingAgentTab.tsx       # 동료 추천/모집 상태 탭
│   │   ├── MobileAppHeader.tsx        # 상단 네비게이션 헤더
│   │   ├── MobileBottomTabBar.tsx     # 하단 4대 탭 바
│   │   ├── MyMatchesTab.tsx           # 내 매칭 관리 & 오픈채팅
│   │   ├── MyPageModal.tsx            # 프로필 설정 & 비공개 토글
│   │   └── ...
│   ├── data/               # 모의 데이터 및 마스코트 아바타
│   ├── theme/              # 테마 컨텍스트 (코랄 오렌지 고정)
│   ├── types.ts            # 공통 인터페이스 및 타입 정의
│   ├── App.tsx             # 메인 앱 라우팅 및 상태 관리
│   └── main.tsx            # 리액트 엔트리포인트
├── index.html              # HTML 템플릿 및 PWA 메타태그
├── package.json            # 프로젝트 설정 및 패키지 목록
└── README.md               # 프로젝트 가이드
```

---

## 🔒 6. 보안 및 개인정보 보호 (Privacy & Security)

- 모든 프로필 항목(이름, 사진, MBTI, 관심사 등)은 사용자 본인의 설정에 따라 **전체 비공개** 가능
- 부서 배치가 진행되기 전(10/14 이전)에는 부서 정보가 임의로 노출되지 않도록 고정
- 연락처나 민감 사번 노출 없이 **카카오톡 1:1 오픈채팅 링크**를 매개로 연결하여 개인정보 유출을 방지

---

## 👥 7. 기여 및 라이선스 (License)

- SK하이닉스 260928 신입 동기 One Team 프로젝트
- 내부 커뮤니티 및 동기 교류 목적 전용
