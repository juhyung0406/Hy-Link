export interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: 'sports',
    name: '운동 / 스포츠',
    icon: '🏃‍♂️',
    subcategories: [
      '러닝',
      '헬스/웨이트',
      '클라이밍',
      '테니스',
      '골프',
      '배드민턴',
      '수영',
      '자전거/라이딩',
      '필라테스/요가',
      '축구/풋살',
      '크로스핏',
      '탁구',
      '서핑',
    ],
  },
  {
    id: 'gourmet',
    name: '미식 / 카페 / 요리',
    icon: '☕',
    subcategories: [
      '핸드드립커피',
      '카페투어',
      '와인/위스키',
      '맛집탐방',
      '베이킹',
      '홈쿠킹',
      '티/차문화',
      '수제맥주',
      '디저트/비건',
      '전통주/페어링',
    ],
  },
  {
    id: 'culture',
    name: '문화 / 예술 / 취미',
    icon: '🎨',
    subcategories: [
      '전시회/갤러리',
      '뮤지컬/연극',
      '영화/드라마',
      '독서/북클럽',
      '재즈/음악감상',
      '악기연주',
      '사진촬영',
      '도예/원데이클래스',
      '미술/드로잉',
      '콘서트/페스티벌',
    ],
  },
  {
    id: 'tech',
    name: '테크 / 자기계발',
    icon: '💻',
    subcategories: [
      'AI/머신러닝',
      '데이터분석',
      '사이드프로젝트',
      '재테크/투자',
      '외국어회화',
      '업무자동화',
      '코딩/웹개발',
      '기획/브랜딩',
      '글쓰기/블로그',
      '자격증/스터디',
    ],
  },
  {
    id: 'travel',
    name: '여행 / 아웃도어',
    icon: '⛺',
    subcategories: [
      '캠핑/차박',
      '백패킹',
      '등산/트레킹',
      '국내여행',
      '해외여행',
      '드라이브',
      '낚시',
      '피크닉/공원',
      '바다/스노클링',
    ],
  },
  {
    id: 'lifestyle',
    name: '게임 / 오락 / 라이프',
    icon: '🎮',
    subcategories: [
      '보드게임',
      '콘솔/PC게임',
      'e스포츠',
      '반려견산책',
      '반려묘',
      '가드닝/식물',
      '방탈출',
      '레고/프라모델',
      '명상/휴식',
    ],
  },
];

export const ALL_DEFAULT_INTERESTS: string[] = INTEREST_CATEGORIES.flatMap((c) => c.subcategories);
