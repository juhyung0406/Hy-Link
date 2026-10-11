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
    <div className="space-y-4 pb-24">
      {/* 1. Main Recruitment Status Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5D7C7] shadow-xs text-center space-y-4">
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30 text-xs font-black shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#FF7A30] animate-spin" />
          <span>신입 동기 풀 모집 진행 중</span>
        </div>

        {/* Icon & Heading */}
        <div className="space-y-1.5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFF0E2] to-[#FFEFE0] border border-[#FFA070]/30 flex items-center justify-center mx-auto text-3xl shadow-xs">
            🚀
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#5A3E36]">
            260928 동기 매칭 풀 모집 중
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            신입 교육(2주) 기간 동안 300명 동기 중 나와 성향과 취미가 잘 맞는 동기를 연결하기 위해 신청서를 접수하고 있습니다.
          </p>
        </div>

        {/* Target Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#EFE3D5] space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-[#5A3E36] flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#FF7A30]" />
              <span>현재 참여 인원</span>
            </span>
            <span className="font-extrabold text-[#D86E38]">
              {registeredCount}명 / 목표 {targetCount}명 ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#FF7A30] to-[#FFA070] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500">
            • 50명 이상이 모이면 관리자의 최종 승인 하에 1:1 맞춤 추천이 순차적으로 오픈됩니다.
          </p>
        </div>

        {/* Info Banner: 10/14 부서배치 관련 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold block">10/14(수) 부서배치 전 라포 형성 안내</span>
            각자 현업으로 흩어지기 전, 취미가 같거나 성향이 잘 맞는 동기를 만들어둘 수 있도록 안전하게 데이터를 준비 중입니다.
          </div>
        </div>

        {/* CTA: Go to Gatherings */}
        <div className="pt-1 space-y-2">
          {onSwitchToGatherings && (
            <button
              type="button"
              onClick={onSwitchToGatherings}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1.5"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>지금 열려있는 [소모임/번개] 둘러보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchToSurvey}
            className="w-full py-2.5 rounded-xl border border-[#E5D7C7] hover:bg-[#FAF4ED] text-[#7A645A] font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF7A30]" />
            <span>내 매칭 신청 조건 확인 및 수정</span>
          </button>
        </div>
      </div>

      {/* 2. My Submitted Preferences Summary */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5D7C7] shadow-xs space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-xs text-[#5A3E36]">내 매칭 신청 정보 (접수 완료)</h3>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            정상 접수됨
          </span>
        </div>

        <div className="space-y-1.5 text-slate-600 text-[11px]">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">만남 목적</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.q1_purpose || '취미 / 운동 메이트'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">선호 동료</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.q2_peerType || '나이가 비슷한 또래 동기'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">모임 형태</span>
            <span className="font-bold text-[#5A3E36]">
              {activeProfile?.groupSizePreference === '1:1' ? '1:1 단독 만남' : '4인 이하 소모임'}
            </span>
          </div>
        </div>

        {/* Selected Interests tags */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block mb-1">선택한 관심 취미</span>
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
