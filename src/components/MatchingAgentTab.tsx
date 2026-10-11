import React from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock,
  ArrowRight,
  Edit3,
  Coffee
} from 'lucide-react';
import { UserProfile, MatchResult } from '../types';
import { useAppTheme } from '../theme/ThemeContext';

interface MatchingAgentTabProps {
  candidates?: any[];
  activeProfile?: any;
  preloadedResults?: MatchResult[] | null;
  onInviteSent?: (match: MatchResult) => void;
  onSwitchToSurvey: () => void;
  onSwitchToGatherings?: () => void;
  registeredCount?: number;
}

export const MatchingAgentTab: React.FC<MatchingAgentTabProps> = ({
  activeProfile,
  onSwitchToSurvey,
  onSwitchToGatherings,
  registeredCount = 42,
}) => {
  const { theme } = useAppTheme();
  const targetCount = 50;
  const progressPercent = Math.min(100, Math.round((registeredCount / targetCount) * 100));

  return (
    <div className="space-y-3.5 pb-24">
      {/* 1. Main Recruitment Status Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5D7C7] shadow-xs text-center space-y-3.5">
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30 text-[11px] font-bold">
          <Clock className="w-3 h-3 text-[#FF7A30] animate-spin" />
          <span>신입 동기 매칭 모집 중</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-lg font-black text-[#5A3E36]">
            260928 동기 매칭 풀
          </h2>
          <p className="text-xs text-slate-500">
            취향과 성향이 맞는 동기를 연결해 드려요.
          </p>
        </div>

        {/* Target Progress Bar */}
        <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#EFE3D5] space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#5A3E36] flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#FF7A30]" />
              <span>현재 참여</span>
            </span>
            <span className="font-extrabold text-[#D86E38]">
              {registeredCount} / {targetCount}명 ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#FF7A30] to-[#FFA070] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500">
            50명 달성 시 1:1 맞춤 추천이 순차적으로 오픈됩니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-0.5 space-y-2">
          {onSwitchToGatherings && (
            <button
              type="button"
              onClick={onSwitchToGatherings}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1.5"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>소모임 / 번개 둘러보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchToSurvey}
            className="w-full py-2 rounded-xl border border-[#E5D7C7] hover:bg-[#FAF4ED] text-[#7A645A] font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF7A30]" />
            <span>신청 정보 수정</span>
          </button>
        </div>
      </div>

      {/* 2. My Submitted Preferences Summary */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5D7C7] shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <h3 className="font-bold text-xs text-[#5A3E36]">내 신청 정보</h3>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            접수 완료
          </span>
        </div>

        <div className="space-y-1 text-slate-600 text-[11px]">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400">만남 목적</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.q1_purpose || '취미 / 운동 메이트'}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400">선호 동료</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.q2_peerType || '나이가 비슷한 또래 동기'}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400">모임 형태</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.groupSizePreference === '1:1' ? '1:1 단독' : '4인 이하 소모임'}
            </span>
          </div>
        </div>

        {/* Selected Interests tags */}
        <div className="pt-1.5 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            {(activeProfile?.q3_interests && activeProfile.q3_interests.length > 0
              ? activeProfile.q3_interests
              : ['#러닝', '#테니스', '#보드게임', '#카페투어']
            ).map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-[#FFF0E2] text-[#D86E38] font-bold text-[10px]">
                {t.startsWith('#') ? t : `#${t}`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
