import React, { useState, useEffect } from 'react';
import { AppTab } from './components/Navbar';
import { MobileAppHeader } from './components/MobileAppHeader';
import { MobileBottomTabBar } from './components/MobileBottomTabBar';
import { ApplicationSurveyView } from './components/ApplicationSurveyView';
import { MatchingAgentTab } from './components/MatchingAgentTab';
import { MyMatchesTab } from './components/MyMatchesTab';
import { DirectoryTab } from './components/DirectoryTab';
import { DashboardTab } from './components/DashboardTab';
import { RoadmapTab } from './components/RoadmapTab';
import { LoginPage } from './components/LoginPage';
import { MyPageModal } from './components/MyPageModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { LiveInteractiveDemoController } from './components/LiveInteractiveDemoController';
import { GatheringTab } from './components/GatheringTab';
import { INITIAL_COLLEAGUES, COLLEAGUE_AVATARS } from './data/mockColleagues';
import { INITIAL_GATHERINGS, MASCOT_AVATARS } from './data/mockGatherings';
import { ColleagueProfile, MatchResult, UserProfile, GatheringItem } from './types';
import { Smartphone, Play } from 'lucide-react';
import { ThemeProvider, useAppTheme } from './theme/ThemeContext';

const DEFAULT_USER: UserProfile = {
  name: '김하늘',
  phone: '010-8292-2609',
  pinCode: '2609',
  department: '미배치 (10/14 부서배치 예정)',
  jobTitle: 'TL (26.09 신입)',
  tenure: '1년차 (26.09 입사)',
  avatar: MASCOT_AVATARS.haru,
  mbti: 'ENFP',
  interests: ['핸드드립커피', '테니스', '러닝', '보드게임'],
  hashtags: ['#ENFP', '#테니스', '#러닝크루', '#커피마실사람'],
  kakaoOpenChatUrl: 'https://open.kakao.com/o/sHY2609Sky',
  privacySettings: {
    isNamePublic: true,
    isAvatarPublic: true,
    isMbtiPublic: true,
    isInterestsPublic: true,
    isHashtagsPublic: true,
    isPhonePublic: false,
  },
  workHistory: [],
  isWorkHistoryPublic: false,
  groupSizePreference: '1:1',
  isVerified260928: true,
  isLoggedIn: false, // Show Login Page first by default as requested!
};

function AppContent() {
  const { theme } = useAppTheme();

  // User authentication and profile state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('hylink_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          avatar: (parsed.avatar && !parsed.avatar.includes('unsplash')) ? parsed.avatar : COLLEAGUE_AVATARS.leeKm,
          hashtags: parsed.hashtags || ['#신입온보딩중', '#티타임환영'],
          workHistory: parsed.workHistory || DEFAULT_USER.workHistory,
          isWorkHistoryPublic: parsed.isWorkHistoryPublic ?? true,
          groupSizePreference: parsed.groupSizePreference || '1:1',
          isLoggedIn: parsed.isLoggedIn ?? false,
        };
      }
    } catch (e) {
      console.error('Error loading saved user profile:', e);
    }
    return DEFAULT_USER;
  });

  // Modals
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Mobile App Native Tabs
  const [activeTab, setActiveTab] = useState<AppTab>('results');
  const [candidates, setCandidates] = useState<ColleagueProfile[]>(INITIAL_COLLEAGUES);

  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [recommendedMatches, setRecommendedMatches] = useState<MatchResult[] | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Sent invitations tracker
  const [sentMatches, setSentMatches] = useState<
    {
      match: MatchResult;
      status: 'accepted' | 'pending';
      sentAt: string;
      meetingTime?: string;
      isGroup?: boolean;
    }[]
  >([]);

  // 260928 Freshmen Gatherings & Lightning Meetups
  const [gatherings, setGatherings] = useState<GatheringItem[]>(() => {
    try {
      const saved = localStorage.getItem('hylink_gatherings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GATHERINGS;
  });

  const handleAddGathering = (item: GatheringItem) => {
    setGatherings((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem('hylink_gatherings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleJoinGathering = (gatheringId: string) => {
    setGatherings((prev) => {
      const updated = prev.map((g) => {
        if (g.id === gatheringId && g.currentCount < g.maxCount) {
          return { ...g, currentCount: g.currentCount + 1 };
        }
        return g;
      });
      try {
        localStorage.setItem('hylink_gatherings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Persist user profile to localStorage
  const saveUserToStorage = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('hylink_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user profile to storage:', e);
    }
  };

  const handleStartDemo = () => {
    if (!currentUser.isLoggedIn) {
      saveUserToStorage({ ...currentUser, isLoggedIn: true });
    }
    setIsDemoActive(true);
  };

  const handleLogin = (profile: UserProfile) => {
    saveUserToStorage({ ...profile, isLoggedIn: true });
    // Transition smoothly to matches recommendation
    setActiveTab('results');
  };

  const handleSaveProfile = (updated: UserProfile) => {
    saveUserToStorage(updated);
    try {
      const raw = localStorage.getItem('hylink_registered_users');
      if (raw) {
        const users = JSON.parse(raw);
        const idx = users.findIndex(
          (u: any) =>
            (updated.phone && u.phone === updated.phone) ||
            u.name === updated.name
        );
        if (idx !== -1) {
          users[idx].name = updated.name;
          if (updated.phone) users[idx].phone = updated.phone;
          if (updated.pinCode) users[idx].pinCode = updated.pinCode;
          users[idx].profile = { ...users[idx].profile, ...updated };
          localStorage.setItem('hylink_registered_users', JSON.stringify(users));
        }
      }
    } catch (e) {
      console.error('Failed to sync profile update to registered users list:', e);
    }
  };

  const handleLogout = () => {
    saveUserToStorage({ ...currentUser, isLoggedIn: false });
  };

  // When user completes survey and clicks "AI 맞춤 동료 매칭 신청"
  const handleStartMatching = async (surveyData: any, isRandom: boolean = false) => {
    setIsMatchingLoading(true);

    if (isRandom) {
      setActiveTab('results');
      setIsMatchingLoading(false);
      return;
    }

    try {
      // Step 1: Extract standardized profile
      const extractRes = await fetch('/api/step1-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
      const extractJson = await extractRes.json();
      const profileData = extractJson.data || surveyData;
      setExtractedProfile(profileData);

      // Step 2: Trigger AI matching engine
      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...profileData,
            meetingPurposes: [surveyData.q1_purpose],
          },
          preferences: {
            purpose: surveyData.q1_purpose,
            priorityFocus: 'balanced',
            preferredTimeSlot: surveyData.q4_meetingStyle,
          },
          candidates,
        }),
      });

      const matchJson = await matchRes.json();
      let results: MatchResult[] = matchJson.success && matchJson.data?.recommendedMatches 
        ? matchJson.data.recommendedMatches 
        : [];

      // If user selected small group (3~4 people) or any group, add a dedicated group match!
      if (surveyData.groupSizePreference === 'small' || surveyData.groupSizePreference === 'any') {
        const groupCands = candidates.slice(0, 3);
        const groupItem: MatchResult = {
          candidateId: `grp_${Date.now()}`,
          candidateName: groupCands.map((c) => c.name).join(', '),
          anonymousAlias: 'One Team 4인 커피챗 소모임',
          avatar: groupCands[0].avatar,
          department: groupCands.map((c) => c.department).join(' · '),
          jobTitle: '4인 소모임',
          matchScore: 96,
          hashtags: ['#4인소그룹', '#부서교류', '#점심티타임', '#네트워킹'],
          synergyKeywords: ['크로스협업', '소그룹', '사내소통'],
          matchReason: '선호하신 4인 이하 소그룹에 맞춰 이종 부서 동료 3명과 함께하는 티타임 모임입니다.',
          commonGround: surveyData.q3_interests?.slice(0, 2).join(', ') || '사내네트워킹',
          icebreakers: [],
          suggestedAgenda: `${groupCands[0].location || '이천 SUPEX 2층 라운지'} (4인 소모임 30분)`,
          outreachMessage: '안녕하세요! One Team 4인 소모임 매칭으로 인사드립니다.',
          isGroup: true,
          groupTitle: '☕ One Team 4인 커피챗 소모임',
          groupMembers: groupCands.map((c) => ({
            id: c.id,
            name: c.name,
            avatar: c.avatar,
            department: c.department,
            jobTitle: c.jobTitle,
            mbti: c.mbti,
            hashtags: c.hashtags,
          })),
        };
        results = [groupItem, ...results];
      }

      setRecommendedMatches(results);
      setActiveTab('results');
    } catch (err) {
      console.error('Error running full matching pipeline:', err);
      setActiveTab('results');
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleAddCandidate = (newCand: ColleagueProfile) => {
    setCandidates((prev) => [newCand, ...prev]);
  };

  const handleSelectForMatching = (target: ColleagueProfile) => {
    setActiveTab('results');
  };

  const handleInviteSent = (match: MatchResult) => {
    setSentMatches((prev) => [
      {
        match,
        status: 'accepted',
        sentAt: '방금 전',
        meetingTime: match.suggestedAgenda || '평일 점심시간 20~30분 사내 카페',
        isGroup: match.isGroup,
      },
      ...prev,
    ]);
  };

  // 1. If not logged in, render the Login / Profile Setup Page first!
  if (!currentUser.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Logged-in Main App
  return (
    <div className={`min-h-screen ${theme.bgCanvas} flex flex-col justify-start items-center sm:py-6 font-sans antialiased transition-colors duration-300`}>
      {/* Desktop view indicator badge */}
      <div className="hidden sm:flex items-center space-x-2 text-slate-500 text-xs mb-3 font-medium">
        <Smartphone className="w-3.5 h-3.5 text-[#FF7A30]" />
        <span className="font-bold text-slate-700">Hy-Link</span>
        <span>• 260928 신입 동기 매칭</span>
      </div>

      {/* Smartphone Device Canvas Container */}
      <div className={`w-full max-w-md min-h-screen sm:min-h-[860px] ${theme.bgCanvas} relative flex flex-col sm:rounded-[36px] sm:shadow-2xl sm:border-[6px] ${theme.borderPrimary} overflow-x-hidden transition-all duration-300`}>
        {/* Mobile Native App Header with Top-Right MyPage Entry */}
        <MobileAppHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={sentMatches.length > 0 ? sentMatches.length : 1}
          currentUser={currentUser}
          onOpenMyPage={() => setIsMyPageOpen(true)}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
          onOpenDemo={handleStartDemo}
        />

        {/* Quick Demo Pill */}
        <div className="px-4 pt-2 pb-0.5">
          <button
            onClick={handleStartDemo}
            className="w-full py-1.5 px-3 rounded-xl bg-[#FFF0E2] hover:bg-[#FFE5D2] border border-[#FFA070]/30 text-[#D86E38] transition-all flex items-center justify-between group active:scale-98"
          >
            <div className="flex items-center space-x-1.5">
              <Play className="w-3 h-3 fill-[#D86E38] text-[#D86E38]" />
              <span className="text-[11px] font-bold">화면 자동 시연 보기</span>
            </div>
            <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100">시작 ▶</span>
          </button>
        </div>

        {/* Scrollable Mobile Content Viewport */}
        <main className="flex-1 w-full px-4 pt-3 pb-6 overflow-y-auto">
          {/* Tab 1: Survey Onboarding (Group size option & #hashtag keywords) */}
          {activeTab === 'survey' && (
            <ApplicationSurveyView
              onStartMatching={handleStartMatching}
              isLoading={isMatchingLoading}
              currentUser={currentUser}
            />
          )}

          {/* Tab 2: Colleague Recommendations & Recruitment Status */}
          {activeTab === 'results' && (
            <MatchingAgentTab
              candidates={candidates}
              activeProfile={extractedProfile || currentUser}
              preloadedResults={recommendedMatches}
              onInviteSent={handleInviteSent}
              onSwitchToSurvey={() => setActiveTab('survey')}
              onSwitchToGatherings={() => setActiveTab('gatherings')}
              registeredCount={42}
            />
          )}

          {/* Tab: Gathering / Lightning Meetups (260928 소모임/번개) */}
          {activeTab === 'gatherings' && (
            <GatheringTab
              gatherings={gatherings}
              onAddGathering={handleAddGathering}
              onJoinGathering={handleJoinGathering}
              currentUser={currentUser}
            />
          )}

          {/* Tab 3: My Matches & 1:1 Kakao Open Chat */}
          {activeTab === 'mymatches' && (
            <MyMatchesTab
              sentMatches={sentMatches}
              onOpenMessenger={(match) => {
                setActiveTab('results');
              }}
            />
          )}

          {/* Tab 4: Colleague Directory */}
          {activeTab === 'directory' && (
            <DirectoryTab
              candidates={candidates}
              onAddCandidate={handleAddCandidate}
              onSelectForMatching={handleSelectForMatching}
            />
          )}

          {/* Admin Fallback Tabs if opened directly */}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'roadmap' && (
            <RoadmapTab
              onGoToSimulator={() => setActiveTab('results')}
              onApplyProfileToMatching={(profile) => {
                setExtractedProfile(profile);
                setActiveTab('results');
              }}
            />
          )}
        </main>

        {/* Mobile Native Bottom Tab Bar */}
        <MobileBottomTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasResults={!!recommendedMatches && recommendedMatches.length > 0}
          matchCount={sentMatches.length}
          gatheringCount={gatherings.length}
        />
      </div>

      {/* Top-Right MyPage Modal */}
      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Admin Portal Modal (KPIs & Metrics) */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* Real Live Interactive Demo Controller with Pixel-Perfect Virtual Mouse Cursor */}
      <LiveInteractiveDemoController
        isActive={isDemoActive}
        onClose={() => setIsDemoActive(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMyPageOpen={isMyPageOpen}
        setIsMyPageOpen={setIsMyPageOpen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
