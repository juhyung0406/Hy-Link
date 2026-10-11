export interface WorkHistoryItem {
  period: string; // e.g. "2023 ~ 현재"
  role: string;   // e.g. "EUV 공정 데이터 분석"
  description: string; // e.g. "노광 공정 불량 감지 모델 개발 및 라인 안정화"
  tags?: string[];
}

export interface ColleagueProfile {
  id: string;
  name: string;
  anonymousAlias?: string; // e.g. "☕ 드립커피와 클라이밍을 즐기는 동료"
  department: string;
  division: string;
  jobTitle: string;
  tenure: string; // e.g., '1년차', '3년차', '7년차'
  avatar: string;
  interests: string[];
  skills: string[];
  mbti?: string;
  cocValues: string[];
  meetingPurposes: string[];
  hashtags?: string[]; // e.g., ['#공정데이터', '#핸드드립러버', '#원팀소통']
  workHistory?: WorkHistoryItem[];
  isWorkHistoryPublic?: boolean;
  bio?: string; // legacy fallback
  preferredTimes: string[];
  location: string;
}

export interface PrivacySettings {
  isNamePublic: boolean;
  isAvatarPublic: boolean;
  isMbtiPublic: boolean;
  isInterestsPublic: boolean;
  isHashtagsPublic: boolean;
  isPhonePublic: boolean;
}

export interface UserProfile {
  name: string;
  phone?: string;
  birthYear?: number;
  department: string; // "미배치 (10/14 부서배치 예정)"
  jobTitle: string;   // "TL (26.09 신입)"
  tenure: string;     // "1년차 (26.09 입사)"
  hireDate?: string;  // "2026.09.28"
  avatar: string;
  mbti: string;
  interests: string[];
  hashtags: string[];
  kakaoOpenChatUrl?: string; // 카카오톡 오픈채팅방 링크
  privacySettings?: PrivacySettings; // 개별 정보 비공개 설정
  bio?: string;
  workHistory: WorkHistoryItem[];
  isWorkHistoryPublic: boolean;
  groupSizePreference: '1:1' | 'small' | 'any';
  isVerified260928?: boolean; // 260928 입사 인증
  pinCode?: string; // 로그인용 고유 숫자 4자리
  isLoggedIn: boolean;
}

export interface GatheringItem {
  id: string;
  title: string;
  category: 'dorm' | 'sports' | 'hobby' | 'coffee' | 'meal';
  categoryLabel: string;
  description: string;
  targetDate: string; // e.g. "오늘 10/11(일) 19:30"
  location: string;   // e.g. "이천 기숙사 C동 로비"
  creatorName: string;
  creatorAvatar: string;
  creatorMbti?: string;
  currentCount: number;
  maxCount: number;
  kakaoLink: string;
  tags: string[];
  joinedMemberIds: string[];
  createdAt: string;
}

export interface MatchPreference {
  purpose: string;
  preferredDepartmentType: 'different' | 'same' | 'any';
  priorityFocus: 'hobby' | 'work_experience' | 'balanced';
  groupSizePreference: '1:1' | 'small' | 'any';
  preferredTimeSlot: string;
  additionalNote?: string;
  isBlindMode?: boolean;
}

export interface MatchMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
  jobTitle: string;
  mbti?: string;
  hashtags?: string[];
}

export interface MatchResult {
  candidateId: string;
  candidateName: string;
  anonymousAlias: string;
  avatar?: string;
  isIdentityRevealed?: boolean;
  department: string;
  jobTitle: string;
  matchScore: number;
  interestMatchRate?: number;
  synergyRate?: number;
  purposeFitRate?: number;
  synergyKeywords: string[];
  hashtags?: string[];
  matchReason: string;
  commonGround: string;
  icebreakers: string[];
  suggestedAgenda: string;
  outreachMessage: string;
  // Group Gathering extensions
  isGroup?: boolean;
  groupType?: '1:1' | 'small' | 'open';
  groupTitle?: string;
  groupMembers?: MatchMember[];
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  senderName?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
}

export interface RoadmapStep {
  stepNumber: number;
  phase: string;
  title: string;
  koreanGoal: string;
  duration: string;
  deliverables: string[];
  architectureOverview: string;
  recommendedModel: string;
  promptData: {
    promptTitle: string;
    systemPrompt: string;
    userInputTemplate: string;
    outputSchemaExample: string;
    tips: string[];
  };
}
