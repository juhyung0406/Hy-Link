import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { MatchResult } from '../types';
import { useAppTheme } from '../theme/ThemeContext';
import { MASCOT_AVATARS } from '../data/mockGatherings';

interface SentMatchItem {
  match: MatchResult;
  status: 'accepted' | 'pending';
  sentAt: string;
  meetingTime?: string;
  isGroup?: boolean;
}

interface MyMatchesTabProps {
  sentMatches?: SentMatchItem[];
  onOpenMessenger?: (match: MatchResult) => void;
  onGoToSurvey?: () => void;
}

export const MyMatchesTab: React.FC<MyMatchesTabProps> = ({ 
  sentMatches = [],
  onGoToSurvey 
}) => {
  const { theme } = useAppTheme();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayList = sentMatches;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-black text-[#5A3E36]">내 매칭 목록</h2>
          <p className="text-[11px] text-slate-500">신청 완료 및 성사된 매칭입니다.</p>
        </div>
        <span className="text-[11px] font-bold text-[#D86E38] bg-[#FFF0E2] px-2 py-0.5 rounded-full">
          {displayList.length}건
        </span>
      </div>

      {/* Matches List or Empty State */}
      {displayList.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-[#E5D7C7] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0E2] flex items-center justify-center text-[#FF7A30]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#5A3E36]">아직 성사된 매칭이 없습니다</h3>
            <p className="text-xs text-slate-500">
              1:1 매칭 신청서를 작성하고 나와 꼭 맞는 동기를 찾아보세요!
            </p>
          </div>
          {onGoToSurvey && (
            <button
              type="button"
              onClick={onGoToSurvey}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white text-xs font-bold shadow-xs active:scale-95"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>1:1 매칭 신청하기</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayList.map((item) => {
            const isAccepted = item.status === 'accepted';
            const mockKakaoUrl = `https://open.kakao.com/o/sHY2609_${item.match.candidateName}`;

            return (
              <div
                key={item.match.candidateId}
                className="bg-white p-4 rounded-3xl border border-[#E5D7C7] shadow-xs space-y-3.5 hover:shadow-md transition-all"
              >
                {/* Header: Status Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isAccepted ? '✓ 매칭 성사 (오픈채팅 가능)' : '⏳ 참여인원 모집 후 연결 대기'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">({item.sentAt})</span>
                  </div>

                  <span className="text-xs font-black text-[#FF7A30]">
                    일치도 {item.match.matchScore}%
                  </span>
                </div>

              {/* Colleague Summary */}
              <div className="flex items-start space-x-3.5">
                <img
                  src={item.match.avatar}
                  alt={item.match.candidateName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FFA070]/60 shadow-xs"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-black text-base text-[#5A3E36]">
                      {item.match.candidateName} TL
                    </h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FFF0E2] text-[#D86E38]">
                      260928 동기
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {item.match.department} · {item.match.jobTitle}
                  </p>

                  <p className="text-[11px] text-[#7A645A] mt-1 line-clamp-1">
                    {item.match.matchReason}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.match.hashtags?.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF4ED] text-[#8C6D62] border border-[#EFE3D5]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Kakao Open Chat Action Bar */}
              {isAccepted ? (
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>카카오 오픈채팅 링크</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">연결 활성화</span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-700 truncate select-all bg-white px-2.5 py-1.5 rounded-xl border border-amber-200">
                    {mockKakaoUrl}
                  </p>

                  <div className="flex space-x-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.match.candidateId, mockKakaoUrl)}
                      className="flex-1 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center space-x-1 hover:bg-amber-100 transition-colors"
                    >
                      {copiedId === item.match.candidateId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>복사 완료!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-700" />
                          <span>링크 복사</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`카카오톡 오픈채팅방(${mockKakaoUrl})으로 이동합니다.`)}
                      className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center space-x-1 transition-colors shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>카카오톡 열기</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[11px]">
                    현재 50명 동기 풀 모집 후 관리자 승인 시 오픈채팅 링크가 열립니다.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
