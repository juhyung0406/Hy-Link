import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  UserCheck, 
  Clock, 
  HeartHandshake,
  Building,
  Check,
  Compass,
  MessageSquarePlus,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ColleagueProfile } from '../types';

interface Step1PlaygroundProps {
  onApplyProfileToMatching: (profile: Partial<ColleagueProfile>) => void;
}

export const Step1Playground: React.FC<Step1PlaygroundProps> = ({ onApplyProfileToMatching }) => {
  // Survey State
  const [name, setName] = useState('김하늘');
  const [department, setDepartment] = useState('반도체공정개발팀');
  const [tenure, setTenure] = useState('신입 (1년차)');

  // Question 1: Core purpose / Motivation
  const purposeOptions = [
    {
      id: '타부서 업무 교류',
      icon: '🏢',
      title: '타부서 업무가 궁금해요',
      desc: '서로 다른 부서의 일하는 방식과 지식을 교류하고 협업 장벽을 낮추고 싶어요',
    },
    {
      id: '취미 친구',
      icon: '🧗',
      title: '취미나 운동을 같이할 동료',
      desc: '퇴근 후나 주말에 같은 취미(커피, 클라이밍, 러닝 등)를 즐길 친구를 찾고 싶어요',
    },
    {
      id: '신입 온보딩 조언',
      icon: '💡',
      title: '사내 적응 노하우 & 멘토링',
      desc: '신입/주니어로서 회사 생활 팁이나 커리어 조언을 듣고 싶어요',
    },
    {
      id: '점심/기숙사 메이트',
      icon: '🍱',
      title: '점심이나 기숙사 밥 친구',
      desc: '혼밥 대신 가볍고 편안하게 점심 식사를 함께할 동료를 만나고 싶어요',
    },
  ];
  const [selectedPurpose, setSelectedPurpose] = useState('타부서 업무 교류');

  // Question 2: Preferred Peer Style
  const peerStyleOptions = [
    {
      id: '이종 부서 동료 (One Team)',
      icon: '🌐',
      title: '서로 다른 부서 동료',
      desc: '평소 만날 일 없는 부서와 교류하여 시야를 넓히고 One Team 시너지를 내고 싶어요',
    },
    {
      id: '비슷한 직무 동료',
      icon: '⚙️',
      title: '비슷한 직무/유관 부서',
      desc: '실무적인 고충이나 공통 기술 스택에 대해 깊이 있는 공감대를 형성하고 싶어요',
    },
    {
      id: '동년배 또래 동료',
      icon: '🤝',
      title: '연차가 비슷한 또래 동료',
      desc: '또래 동료와 부담 없이 편안하고 친근한 사내 친구 관계를 맺고 싶어요',
    },
    {
      id: '경험 많은 선배/시니어',
      icon: '🧭',
      title: '경험 많은 선배/시니어',
      desc: '회사 생활과 업무 경험이 풍부한 선배의 인사이트와 방향성 조언을 듣고 싶어요',
    },
  ];
  const [selectedPeerStyle, setSelectedPeerStyle] = useState('이종 부서 동료 (One Team)');

  // Question 3: Interests / Hobbies (Multi-select pills)
  const interestPool = [
    '핸드드립커피', '클라이밍', '러닝/헬스', '데이터분석', 
    '캠핑/아웃도어', '와인/미식', '테니스', '보드게임', 
    '독서/스터디', '베이킹', '전시회 관람', '반려동물 산책'
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '핸드드립커피', '클라이밍', '데이터분석'
  ]);

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== item));
      }
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, item]);
      }
    }
  };

  // Question 4: Meeting Format
  const meetingFormats = [
    '평일 점심시간 20~30분 사내 카페 커피챗',
    '점심 식사 함께하기',
    '퇴근 후 30분 가벼운 티타임',
    '주말 사외 취미/운동 활동'
  ];
  const [selectedMeetingFormat, setSelectedMeetingFormat] = useState('평일 점심시간 20~30분 사내 카페 커피챗');

  // Narrative intro: Optional 1-line thought
  const [narrativeIntro, setNarrativeIntro] = useState(
    '신입이라 아직 다른 부서 분들을 뵐 기회가 없었는데, 편하게 커피 한잔하며 공정 데이터가 어떻게 쓰이는지 여쭙고 취미도 나누고 싶어요!'
  );

  const quickIntroPresets = [
    '신입이라 아직 다른 부서 분들을 뵐 기회가 없었는데, 편하게 커피 한잔하며 이야기 나누고 싶어요!',
    '엔지니어/현업 동료들과 점심 먹으며 일하는 방식도 배우고 사내 취미 친구도 만들고 싶습니다.',
    '주말에 함께 가볍게 운동이나 커피 마시며 소소하게 회사 생활 이야기 나눌 분 찾아요 😊'
  ];

  // Execution state
  const [isLoading, setIsLoading] = useState(false);
  const [synthesizedProfile, setSynthesizedProfile] = useState<any>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleRunStep1 = async () => {
    setIsLoading(true);
    setSynthesizedProfile(null);
    setAppliedNotice(false);

    try {
      const res = await fetch('/api/step1-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          department,
          tenure,
          q1_purpose: selectedPurpose,
          q2_peerType: selectedPeerStyle,
          q3_interests: selectedInterests,
          q4_meetingStyle: selectedMeetingFormat,
          narrativeIntro,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSynthesizedProfile(json.data);
      }
    } catch (err) {
      console.error('Step 1 synthesis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferToStep2 = () => {
    if (!synthesizedProfile) return;
    onApplyProfileToMatching({
      name: synthesizedProfile.name,
      department: synthesizedProfile.department,
      jobTitle: `${synthesizedProfile.jobCategory} • ${synthesizedProfile.tenureCategory}`,
      interests: synthesizedProfile.interests,
      meetingPurposes: synthesizedProfile.meetingPurposes,
      cocValues: synthesizedProfile.cocValues,
      bio: synthesizedProfile.refinedBio,
    });
    setAppliedNotice(true);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white p-5 sm:p-7 shadow-xl space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1단계 실현: 3~4단계 객관식 설문 + 서술형 자기소개 결합</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            30초 초간단 객관식 설문 & 자기소개 한마디
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            긴 글 작성의 피로도를 없애기 위해 사용 목적이 높은 <strong>3~4가지 핵심 문항을 객관식으로 선택</strong>하고, <strong>가벼운 한줄 서술</strong>을 더해 AI가 최적의 매칭 프로필을 합성합니다.
          </p>
        </div>

        <button
          onClick={handleRunStep1}
          disabled={isLoading}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950 transition-all disabled:opacity-50 self-start sm:self-center shrink-0"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI 프로필 생성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>설문 기반 AI 프로필 생성</span>
            </>
          )}
        </button>
      </div>

      {/* Main Layout: Left Survey Form (7 cols), Right Generated Profile Result (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: 4-Step Interactive Survey Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 0: Basic Info Bar */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>기본 정보 (사내 계정 연동)</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">소속 부서</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">연차 구분</label>
                <input
                  type="text"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Q1: Meeting Purpose (핵심 사용 이유) */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                1
              </span>
              <label className="text-xs sm:text-sm font-bold text-white">
                이 앱을 사용하시는 가장 큰 목적(이유)은 무엇인가요?
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {purposeOptions.map((opt) => {
                const isSelected = selectedPurpose === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPurpose(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 text-white ring-1 ring-rose-500'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-rose-300' : 'text-slate-200'}`}>
                            {opt.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q2: Preferred Peer Style (선호 상대방 스타일) */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <label className="text-xs sm:text-sm font-bold text-white">
                어떤 유형의 동료를 추천받고 싶으신가요?
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {peerStyleOptions.map((opt) => {
                const isSelected = selectedPeerStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPeerStyle(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 text-white ring-1 ring-rose-500'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-rose-300' : 'text-slate-200'}`}>
                            {opt.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q3: Interests Quick Click Chips */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <label className="text-xs sm:text-sm font-bold text-white">
                  관심 있는 취미나 대화 키워드를 골라주세요 (최대 5개)
                </label>
              </div>
              <span className="text-[11px] text-slate-400">
                {selectedInterests.length}개 선택됨
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              {interestPool.map((item) => {
                const isSelected = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>#{item}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q4: Meeting Style & Narrative Intro (서술형 자기소개) */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                4
              </span>
              <label className="text-xs sm:text-sm font-bold text-white">
                선호하는 만남 형태 & 동료에게 전하고 싶은 한마디 (서술형)
              </label>
            </div>

            {/* Meeting format selector */}
            <div className="grid grid-cols-2 gap-2">
              {meetingFormats.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedMeetingFormat(fmt)}
                  className={`p-2 rounded-lg text-left text-xs transition-all border ${
                    selectedMeetingFormat === fmt
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{fmt}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Narrative Input with one-click presets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">동료에게 전할 한줄 자기소개 (자유 서술)</span>
                <span className="text-[10px] text-rose-400">직접 입력하거나 아래 추천 문구 클릭</span>
              </div>

              <textarea
                rows={3}
                value={narrativeIntro}
                onChange={(e) => setNarrativeIntro(e.target.value)}
                placeholder="예: 편하게 커피 한잔하며 다른 부서 이야기도 듣고 취미도 나누고 싶어요!"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
              />

              {/* Quick Preset Buttons (작성 귀찮은 사람들을 위한 원클릭) */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>원클릭 추천 문구로 바로 채우기:</span>
                </span>
                <div className="flex flex-col gap-1">
                  {quickIntroPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNarrativeIntro(preset)}
                      className="text-left text-[11px] text-slate-400 hover:text-rose-300 hover:bg-slate-900 px-2 py-1 rounded transition-colors truncate"
                    >
                      • "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRunStep1}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI가 설문과 한마디를 융합하는 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>객관식 설문 + 한마디로 매칭 프로필 완성하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Standard Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>1단계 실현 결과: 표준화된 프로필 카드</span>
            </span>
            {synthesizedProfile && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30">
                매칭 준비 완료
              </span>
            )}
          </div>

          {!synthesizedProfile && !isLoading && (
            <div className="bg-slate-950/40 rounded-xl border border-dashed border-slate-800 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-rose-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                왼쪽에서 <strong>3~4단계 객관식 설문을 클릭</strong>하고 <strong>[설문 기반 AI 프로필 생성]</strong>을 누르면, Gemini 3.8 Flash가 즉시 사내 One Team 매칭 프로필로 합성합니다.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                선택하신 객관식 설문과 한마디를 다차원 프로필로 정규화 중...
              </p>
            </div>
          )}

          {synthesizedProfile && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 shadow-lg">
              {/* Blind Mode Notice Banner */}
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>블라인드 보안 모드: 이름·나이 비공개</span>
                </div>
                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  사내 메신저로 대상을 특정하여 선입견이 생기지 않도록, <strong>상호 수락 전까지 실명과 나이는 숨겨지며 오직 '선택한 공통점'으로만 상대방에게 인식</strong>됩니다.
                </p>
              </div>

              {/* User Header (Blind Persona View) */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-rose-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                    {synthesizedProfile.anonymousAlias?.slice(0, 2) || '☕'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {synthesizedProfile.anonymousAlias || '공통점 기반 동료'}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{synthesizedProfile.department}</span>
                      <span>•</span>
                      <span className="text-rose-300 font-medium">실명 마스킹됨 (김**)</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">매칭 준비도</span>
                  <span className="text-sm font-black text-emerald-400">
                    {synthesizedProfile.matchReadinessScore || 99}점
                  </span>
                </div>
              </div>

              {/* Common Ground Only Section (상대방에게 보이는 공통점 카드) */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>상대방에게 인식되는 공통점 카드</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    공통점 기반 매칭
                  </span>
                </div>

                {/* Blind Bio (이름/나이 배제, 오직 공통점 중심) */}
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  "{synthesizedProfile.blindBio || synthesizedProfile.refinedBio}"
                </p>

                {/* Common ground tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    매칭 상대방과 공유하는 공통 키워드:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {synthesizedProfile.interests.map((item: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[11px] font-semibold border border-rose-500/30"
                      >
                        #{item}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                      🎯 목적: {synthesizedProfile.primaryPurpose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preferred Time & CoC */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate max-w-[180px]">{synthesizedProfile.preferredTimes?.[0]}</span>
                </div>
                <div className="flex items-center space-x-1 text-rose-400 font-semibold text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  <span>One Team 공감</span>
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {appliedNotice && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>블라인드 프로필이 2단계 매칭 엔진에 성공적으로 전달되었습니다!</span>
                  </p>
                )}

                <button
                  onClick={handleTransferToStep2}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <span>이 공통점 프로필로 2단계 AI 매칭 진행</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
