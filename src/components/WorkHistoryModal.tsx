import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  Tag, 
  Lock, 
  Unlock, 
  Building, 
  MapPin, 
  Sparkles,
  Award,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { ColleagueProfile } from '../types';
import { ImageEnlargeModal } from './ImageEnlargeModal';
import { useAppTheme } from '../theme/ThemeContext';

interface WorkHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleague: ColleagueProfile | null;
  isCurrentUser?: boolean;
  onTogglePrivacy?: (isPublic: boolean) => void;
}

export const WorkHistoryModal: React.FC<WorkHistoryModalProps> = ({
  isOpen,
  onClose,
  colleague,
  isCurrentUser = false,
  onTogglePrivacy,
}) => {
  const { theme } = useAppTheme();
  const [isPhotoEnlarged, setIsPhotoEnlarged] = useState(false);

  if (!isOpen || !colleague) return null;

  const isPublic = colleague.isWorkHistoryPublic !== false;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`w-full max-w-md max-h-[90vh] ${theme.bgCanvas} rounded-3xl border ${theme.borderPrimary} shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className={`px-5 py-4 ${theme.headerBg} border-b ${theme.borderPrimary} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-[#FFA070]" />
            <h2 className={`text-base font-black ${theme.textPrimary}`}>
              업무 히스토리 & 커리어
            </h2>
          </div>
          <button
            data-demo-id="work-history-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Profile Card Summary */}
          <div className={`p-4 rounded-2xl ${theme.bgSurface} border ${theme.borderPrimary} shadow-xs flex items-center space-x-3.5`}>
            <div 
              onClick={() => setIsPhotoEnlarged(true)}
              className="relative shrink-0 cursor-pointer active:scale-95 transition-transform group"
              title="사진 클릭하여 크게 보기 (확대)"
            >
              <img
                src={colleague.avatar}
                alt={colleague.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FFA070]/60 shadow-sm group-hover:scale-105 group-hover:border-[#FFA070] transition-all"
              />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1" />
              <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-md bg-[#5A3E36] text-white text-[8px] font-black shadow-2xs">
                🔍 확대
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`font-black text-lg ${theme.textPrimary} truncate`}>
                  {colleague.name} TL
                </h3>
                {colleague.mbti && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30 shrink-0">
                    {colleague.mbti}
                  </span>
                )}
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-0.5 font-medium`}>
                {colleague.department} · {colleague.jobTitle}
              </p>
              {colleague.location && (
                <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#FFA070] shrink-0" />
                  <span className="truncate">{colleague.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Hashtag Keywords */}
          {colleague.hashtags && colleague.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {colleague.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white text-[#D86E38] text-xs font-black border border-[#FFA070]/30 shadow-2xs"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Privacy Toggle / Status Banner */}
          <div className={`p-3.5 rounded-2xl border ${isPublic ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Unlock className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-amber-600" />
              )}
              <div>
                <span className={`text-xs font-black ${isPublic ? 'text-emerald-900' : 'text-amber-900'} block`}>
                  {isPublic ? '업무 히스토리 공개 상태' : '업무 히스토리 비공개 상태'}
                </span>
                <span className={`text-[10px] ${isPublic ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isCurrentUser
                    ? '상대방에게 보여질 공개 범위를 직접 설정할 수 있습니다.'
                    : isPublic
                    ? '동료가 공개로 설정하여 누구나 열람할 수 있습니다.'
                    : '동료가 비공개로 설정하였습니다.'}
                </span>
              </div>
            </div>

            {/* If current user, allow toggling right here */}
            {isCurrentUser && onTogglePrivacy && (
              <button
                type="button"
                onClick={() => onTogglePrivacy(!isPublic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 shadow-2xs ${
                  isPublic
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isPublic ? '비공개로 전환' : '공개로 전환'}</span>
              </button>
            )}
          </div>

          {/* Work History Content */}
          {isPublic ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#FFA070]" />
                <span>주요 담당 업무 & 프로젝트 경험</span>
              </div>

              {colleague.workHistory && colleague.workHistory.length > 0 ? (
                <div className="space-y-2.5">
                  {colleague.workHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl ${theme.bgSurface} border ${theme.borderPrimary} shadow-xs space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#D86E38] bg-[#FFF0E2] px-2 py-0.5 rounded-md border border-[#FFA070]/30">
                          {item.period}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">프로젝트</span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-black ${theme.textPrimary}`}>
                        {item.role}
                      </h4>

                      <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 rounded-2xl ${theme.bgSurface} border ${theme.borderPrimary} text-center space-y-1`}>
                  <p className="text-xs text-slate-500 font-medium">등록된 업무 히스토리가 없습니다.</p>
                </div>
              )}
            </div>
          ) : (
            /* Private Locked View */
            <div className={`p-8 rounded-2xl ${theme.bgSurface} border border-dashed border-amber-300 text-center space-y-3`}>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">
                  비공개로 설정된 업무 히스토리입니다
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  상대 동료가 개인정보 보호를 위해 비공개로 설정했습니다. 상호 커피챗 수락 후 편안하게 직접 물어보세요!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 ${theme.headerBg} border-t ${theme.borderPrimary} flex items-center justify-end`}>
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl ${theme.gradientButton} text-white font-black text-xs shadow-xs transition-all active:scale-98`}
          >
            확인
          </button>
        </div>
      </div>

      {/* Image Enlarge Modal */}
      {isPhotoEnlarged && (
        <ImageEnlargeModal
          isOpen={isPhotoEnlarged}
          onClose={() => setIsPhotoEnlarged(false)}
          imageUrl={colleague.avatar}
          name={colleague.name}
          department={colleague.department}
          jobTitle={colleague.jobTitle}
          mbti={colleague.mbti}
          hashtags={colleague.hashtags}
          location={colleague.location}
        />
      )}
    </div>
  );
};
