import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Check, 
  ArrowLeft, 
  RefreshCw, 
  ChevronRight,
  UserCheck,
  Users,
  User,
  Plus,
  X,
  Hash
} from 'lucide-react';
import { useAppTheme } from '../theme/ThemeContext';
import { CategorizedInterestSelector } from './CategorizedInterestSelector';
import { UserProfile } from '../types';

interface ApplicationSurveyViewProps {
  onStartMatching: (surveyData: any, isRandom?: boolean) => Promise<void>;
  isLoading: boolean;
  currentUser?: UserProfile;
}

export const ApplicationSurveyView: React.FC<ApplicationSurveyViewProps> = ({
  onStartMatching,
  isLoading,
  currentUser,
}) => {
  const { theme } = useAppTheme();

  // Mobile Step Wizard: 1 to 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User Profile Info
  const name = currentUser?.name || '신입';
  const department = currentUser?.department || '미배치 (부서배치 예정)';
  const tenure = currentUser?.tenure || '1년차 (26.09 신입)';

  // Question 1: Purpose (260928 신입 특화)
  const purposeOptions = [
    { 
      id: '취미/운동 메이트', 
      icon: '🎾', 
      title: '취미 / 운동 메이트', 
      desc: '테니스, 러닝, 클라이밍, 헬스, 보드게임 등 취미를 함께할 동기' 
    },
    { 
      id: '점심/기숙사 메이트', 
      icon: '🍱', 
      title: '점심 / 기숙사 메이트', 
      desc: '기숙사에서 야식/수다 떨거나 교육 기간 중 점심을 함께할 동기' 
    },
    { 
      id: '타부서 업무 교류', 
      icon: '🏢', 
      title: '타부서 업무 교류 (10/14 배치 후)', 
      desc: '10/14 현업 배치 이후 서로 다른 영역의 고충과 경험을 나눌 동기' 
    },
  ];
  const [selectedPurpose, setSelectedPurpose] = useState('취미/운동 메이트');

  // Question 2: Peer Style (또래/나이 선택)
  const peerStyleOptions = [
    { 
      id: '나이가 비슷한 또래 동료', 
      icon: '🤝', 
      title: '나이가 비슷한 또래 동기', 
      desc: '서로 편하게 터놓고 지낼 수 있는 동갑/또래 동기' 
    },
    { 
      id: '서로 다른 부서 동료', 
      icon: '🌐', 
      title: '서로 다른 부서 동기 (배치 후)', 
      desc: '10/14 부서 배치 후 타 영역 소통 파트너' 
    },
    { 
      id: '비슷한 직무 동료', 
      icon: '⚙️', 
      title: '비슷한 직무 동기', 
      desc: '공정, 설계, 연구개발 등 직무 관심사가 통하는 동기' 
    },
  ];
  const [selectedPeerStyle, setSelectedPeerStyle] = useState('나이가 비슷한 또래 동료');
  const [ageRangePreference, setAgeRangePreference] = useState<'same' | 'plusminus1' | 'plusminus2' | 'any'>('plusminus1');

  // Question 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests && currentUser.interests.length > 0
      ? currentUser.interests
      : []
  );

  // Question 4-A: Group Size Preference (1:1, 4인 이하, 5인 이상 다인원)
  const groupSizeOptions: { id: '1:1' | 'small' | 'any'; icon: string; title: string; desc: string }[] = [
    { id: '1:1', icon: '👤', title: '1:1 단독 만남', desc: '단둘이 진솔하고 깊이 있는 커피챗' },
    { id: 'small', icon: '👥', title: '4인 이하 소그룹', desc: '부담 없는 편안한 3~4인 소모임' },
    { id: 'any', icon: '🌐', title: '다인원 그룹 (5인 이상)', desc: '다양한 부서 동료들과의 열린 네트워킹' },
  ];
  const [selectedGroupSize, setSelectedGroupSize] = useState<'1:1' | 'small' | 'any'>('1:1');

  // Question 4-B: Meeting Formats
  const meetingFormats = [
    '평일 점심시간 20~30분 사내 카페 커피챗',
    '점심 식사 함께하기',
    '퇴근 후 30분 가벼운 티타임',
    '주말 사외 취미/운동 활동',
  ];
  const [selectedMeetingFormat, setSelectedMeetingFormat] = useState(
    '평일 점심시간 20~30분 사내 카페 커피챗'
  );

  // Question 4-C: Hashtags (Replaces narrative intro with #)
  const HASHTAG_PRESETS = [
    '#신입온보딩중',
    '#티타임환영',
    '#사내카페단골',
    '#원팀마인드',
    '#주말러너',
    '#테크트렌드',
    '#보드게임러',
    '#공정분석러',
    '#소통지향',
    '#칼퇴지향',
  ];

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(
    currentUser?.hashtags && currentUser.hashtags.length > 0
      ? currentUser.hashtags
      : []
  );
  const [customTagInput, setCustomTagInput] = useState('');

  const toggleHashtag = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (selectedHashtags.includes(formatted)) {
      setSelectedHashtags(selectedHashtags.filter((t) => t !== formatted));
    } else {
      if (selectedHashtags.length < 5) {
        setSelectedHashtags([...selectedHashtags, formatted]);
      }
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('#')) trimmed = `#${trimmed}`;
    if (!selectedHashtags.includes(trimmed)) {
      if (selectedHashtags.length < 5) {
        setSelectedHashtags([...selectedHashtags, trimmed]);
      }
    }
    setCustomTagInput('');
  };

  const handleSubmit = () => {
    onStartMatching(
      {
        name,
        department,
        tenure,
        q1_purpose: selectedPurpose,
        q2_peerType: selectedPeerStyle,
        q3_interests: selectedInterests,
        groupSizePreference: selectedGroupSize,
        q4_meetingStyle: selectedMeetingFormat,
        hashtags: selectedHashtags,
      },
      false
    );
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Clean Survey Header & Progress */}
      <div className={`p-4 sm:p-5 rounded-3xl border ${theme.borderPrimary} ${theme.bgSurface} shadow-xs space-y-3`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">📝</span>
            <span className={`font-black ${theme.textPrimary} text-sm sm:text-base`}>
              Hy-Link 매칭 신청서
            </span>
          </div>
          <span className={`text-[11px] font-bold ${theme.textMuted}`}>{currentStep} / 4 단계</span>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`h-2 rounded-full transition-all ${
                currentStep >= step ? `${theme.gradientButton}` : 'bg-slate-200/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Meeting Purpose */}
      {currentStep === 1 && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="space-y-0.5 px-1">
            <h2 className={`text-lg font-black ${theme.textPrimary}`}>
              매칭 참여 목적
            </h2>
            <p className={`text-xs ${theme.textSecondary}`}>
              원하시는 목적을 선택해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {purposeOptions.map((opt) => {
              const isSelected = selectedPurpose === opt.id;
              return (
                <button
                  key={opt.id}
                  data-demo-id={`survey-purpose-${opt.id}`}
                  type="button"
                  onClick={() => setSelectedPurpose(opt.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                    isSelected
                      ? `bg-[#FFF0E2] border-[#FFA070] ring-2 ring-[#FFA070]/20 shadow-xs`
                      : `${theme.bgSurface} ${theme.borderPrimary} hover:border-[#FFA070]/50 shadow-2xs`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl shrink-0">{opt.icon}</span>
                    <span className={`text-sm font-bold ${isSelected ? 'text-[#5A3E36]' : theme.textPrimary}`}>
                      {opt.title}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#FFA070] stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Peer Style */}
      {currentStep === 2 && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="space-y-0.5 px-1">
            <h2 className={`text-lg font-black ${theme.textPrimary}`}>
              선호하는 동기 유형
            </h2>
            <p className={`text-xs ${theme.textSecondary}`}>
              만나고 싶은 동기 스타일을 선택해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {peerStyleOptions.map((opt) => {
              const isSelected = selectedPeerStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  data-demo-id={`survey-peer-${opt.id}`}
                  type="button"
                  onClick={() => setSelectedPeerStyle(opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                    isSelected
                      ? `bg-[#FFF0E2] border-[#FFA070] ring-2 ring-[#FFA070]/20 shadow-xs`
                      : `${theme.bgSurface} ${theme.borderPrimary} hover:border-[#FFA070]/50 shadow-2xs`
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-2xl shrink-0">{opt.icon}</span>
                    <div>
                      <span className={`text-sm sm:text-base font-black block ${isSelected ? 'text-[#5A3E36]' : theme.textPrimary}`}>
                        {opt.title}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{opt.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#FFA070] stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Age range fine-tuning when '또래' is selected */}
          {selectedPeerStyle === '나이가 비슷한 또래 동료' && (
            <div className="p-3.5 rounded-2xl bg-[#FFF6EE] border border-[#FFA070]/30 space-y-2 animate-in fade-in">
              <span className="text-[11px] font-black text-[#5A3E36] block">
                희망하는 또래 나이 허용 범위 (선택)
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { id: 'same', label: '동갑만' },
                  { id: 'plusminus1', label: '±1세 (동갑~1살)' },
                  { id: 'plusminus2', label: '±2세' },
                  { id: 'any', label: '상관없음' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAgeRangePreference(item.id as any)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-black transition-all ${
                      ageRangePreference === item.id
                        ? 'bg-[#FF7A30] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-[#E5D7C7]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Interests */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1 px-1">
            <h2 className={`text-xl font-black ${theme.textPrimary} leading-tight`}>
              취미나 관심사를 골라주세요
            </h2>
            <p className={`text-xs ${theme.textSecondary}`}>
              대분류 탭을 눌러 다양한 관심사를 선택하거나 직접 입력하세요
            </p>
          </div>

          <div className={`${theme.bgSurface} p-4 sm:p-5 rounded-3xl border ${theme.borderPrimary} shadow-xs`}>
            <CategorizedInterestSelector
              selectedInterests={selectedInterests}
              onChange={setSelectedInterests}
              maxSelections={6}
              label="관심사 선택"
              helperText="공통 관심사가 많을수록 대화가 한결 편안해집니다."
            />
          </div>
        </div>
      )}

      {/* STEP 4: Group Size Preference, Meeting Formats & Hashtags (NO text intro!) */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1 px-1">
            <h2 className={`text-xl font-black ${theme.textPrimary} leading-tight`}>
              모임 인원 및 #해시태그 설정
            </h2>
            <p className={`text-xs ${theme.textSecondary}`}>
              희망 인원 규모(1:1 또는 단체 그룹)와 나를 나타낼 태그를 골라주세요
            </p>
          </div>

          {/* 1. Group Size Preference (1:1, 4인 이하, 5인 이상) */}
          <div className={`p-4 rounded-3xl ${theme.bgSurface} border ${theme.borderPrimary} shadow-xs space-y-2.5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${theme.textPrimary} flex items-center space-x-1.5`}>
                <Users className="w-3.5 h-3.5 text-[#FFA070]" />
                <span>희망 모임 인원 선택</span>
              </span>
              <span className="text-[10px] text-[#D86E38] font-bold">단체 선택 시 단체방 연결</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {groupSizeOptions.map((opt) => {
                const isSelected = selectedGroupSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    data-demo-id={`survey-group-${opt.id}`}
                    type="button"
                    onClick={() => setSelectedGroupSize(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FFF0E2] border-[#FFA070] ring-2 ring-[#FFA070]/20'
                        : `${theme.bgSurfaceSecondary} ${theme.borderPrimary} hover:border-[#FFA070]/40`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl shrink-0">{opt.icon}</span>
                      <div>
                        <span className={`text-xs sm:text-sm font-black block ${isSelected ? 'text-[#5A3E36]' : theme.textPrimary}`}>
                          {opt.title}
                        </span>
                        <span className={`text-[11px] ${theme.textMuted}`}>{opt.desc}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#FFA070] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Meeting Formats */}
          <div className="grid grid-cols-2 gap-2">
            {meetingFormats.map((fmt) => (
              <button
                key={fmt}
                data-demo-id={`survey-format-${fmt}`}
                type="button"
                onClick={() => setSelectedMeetingFormat(fmt)}
                className={`p-3 rounded-2xl text-left text-xs transition-all border ${
                  selectedMeetingFormat === fmt
                    ? 'bg-[#FFF0E2] border-[#FFA070] text-[#5A3E36] font-black'
                    : `${theme.bgSurface} ${theme.borderPrimary} ${theme.textSecondary} hover:bg-black/5`
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFA070] shrink-0" />
                  <span className="truncate">{fmt}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 3. Hashtags (Replaced Narrative Intro with # tags!) */}
          <div className={`p-4 rounded-3xl ${theme.bgSurface} border ${theme.borderPrimary} shadow-xs space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${theme.textPrimary} flex items-center space-x-1.5`}>
                <Hash className="w-3.5 h-3.5 text-[#FFA070]" />
                <span>나를 표현하는 #해시태그 (최대 5개)</span>
              </span>
              <span className="text-[11px] font-black text-[#D86E38] bg-[#FFF0E2] px-2 py-0.5 rounded-full">
                {selectedHashtags.length}/5
              </span>
            </div>

            {/* Custom Tag Direct Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="#직접입력 (예: #모닝커피러버)"
                className={`flex-1 px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
              />
              <button
                type="button"
                onClick={() => handleAddCustomTag()}
                disabled={!customTagInput.trim() || selectedHashtags.length >= 5}
                className="px-3 py-2 rounded-xl bg-[#5A3E36] text-white text-xs font-black disabled:opacity-40 flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </div>

            {/* Selected Hashtags */}
            {selectedHashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#FFF9F3] border border-[#FDE5D2]">
                {selectedHashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-white text-[#D86E38] border border-[#FFA070]/40 shadow-2xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => toggleHashtag(tag)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Preset Hashtag Pills */}
            <div className="space-y-1.5 pt-1">
              <span className={`text-[10px] ${theme.textMuted} font-bold block`}>
                터치하여 바로 선택하기:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {HASHTAG_PRESETS.map((preset) => {
                  const isSelected = selectedHashtags.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => toggleHashtag(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#FFA070] text-white font-black'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profile verification summary pill */}
          <div className={`p-3.5 ${theme.bgSurfaceSecondary} rounded-2xl text-xs ${theme.textSecondary} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[#FFA070]" />
              <span className="font-bold">{name} ({department}, {tenure})</span>
            </div>
            <span className="text-[#D86E38] font-bold text-[11px]">
              {selectedGroupSize === '1:1' ? '1:1 매칭 모드' : selectedGroupSize === 'small' ? '4인 이하 소그룹 모드' : '다인원 그룹 모드'}
            </span>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Controls */}
      <div className={`fixed bottom-16 left-0 right-0 max-w-md mx-auto px-5 py-4 ${theme.bottomBarBg} border-t ${theme.borderPrimary} z-40 flex items-center space-x-3`}>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={`w-13 h-13 rounded-2xl border ${theme.borderPrimary} ${theme.bgSurface} flex items-center justify-center ${theme.textSecondary} hover:bg-black/5 transition-colors shrink-0`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {currentStep < 4 ? (
          <button
            data-demo-id="survey-next-step-btn"
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className={`flex-1 h-13 rounded-2xl ${theme.gradientButton} text-white font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#FFA070]/20 active:scale-98`}
          >
            <span>다음 단계</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            data-demo-id="survey-submit-btn"
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className={`flex-1 h-13 rounded-2xl ${theme.gradientButton} text-white font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#FFA070]/30 disabled:opacity-50 active:scale-98`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>One Team AI 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {selectedGroupSize === '1:1' ? '1:1 맞춤 매칭 신청' : '소그룹/단체 매칭 신청'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
