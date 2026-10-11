import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Briefcase, 
  Coffee, 
  Sparkles,
  MapPin,
  Maximize2,
  Check
} from 'lucide-react';
import { useAppTheme } from '../theme/ThemeContext';

interface ImageEnlargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  name: string;
  department?: string;
  jobTitle?: string;
  mbti?: string;
  hashtags?: string[];
  location?: string;
  onViewWorkHistory?: () => void;
  onRequestCoffeeChat?: () => void;
}

export const ImageEnlargeModal: React.FC<ImageEnlargeModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  name,
  department,
  jobTitle,
  mbti,
  hashtags = [],
  location,
  onViewWorkHistory,
  onRequestCoffeeChat,
}) => {
  const { theme } = useAppTheme();
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-full max-w-sm sm:max-w-md ${theme.bgCanvas} rounded-3xl border ${theme.borderPrimary} shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}>
        {/* Header with Title & Close button */}
        <div className={`px-5 py-3.5 ${theme.headerBg} border-b ${theme.borderPrimary} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FFA070]" />
            <h3 className={`text-sm font-black ${theme.textPrimary}`}>
              {name} 님의 프로필 사진
            </h3>
            {mbti && (
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30">
                {mbti}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={toggleZoom}
              className="p-1.5 rounded-full hover:bg-black/5 text-slate-500 transition-colors"
              title={zoomLevel > 1 ? '축소' : '확대'}
            >
              {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-slate-500 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-Definition Photo Container */}
        <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[340px] max-h-[460px] select-none">
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full object-cover sm:object-contain transition-transform duration-300 ease-out cursor-zoom-in ${
              zoomLevel === 1.5 ? 'scale-150' : zoomLevel === 2 ? 'scale-200' : 'scale-100'
            }`}
            onClick={toggleZoom}
          />

          {/* Zoom hint overlay badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center space-x-1 pointer-events-none">
            <Maximize2 className="w-3 h-3" />
            <span>{zoomLevel}x {zoomLevel > 1 ? '확대 중' : '클릭하여 확대'}</span>
          </div>
        </div>

        {/* Profile Card Meta & Quick Actions */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className={`text-base font-black ${theme.textPrimary}`}>
                  {name}
                </h4>
                {mbti && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFF0E2] text-[#D86E38]">
                    {mbti}
                  </span>
                )}
              </div>
              {(department || jobTitle) && (
                <p className={`text-xs ${theme.textSecondary} mt-0.5 font-medium`}>
                  {department} {jobTitle && `· ${jobTitle}`}
                </p>
              )}
              {location && (
                <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#FFA070] shrink-0" />
                  <span>{location}</span>
                </p>
              )}
            </div>

            {/* Work History Button */}
            {onViewWorkHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewWorkHistory();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FFF0E2] text-[#D86E38] hover:bg-[#FFE5D2] text-xs font-black border border-[#FFA070]/30 transition-all flex items-center space-x-1 shadow-2xs active:scale-95 shrink-0"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>업무 히스토리</span>
              </button>
            )}
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#FFF9F3] text-[#D86E38] text-[11px] font-black border border-[#FDE5D2]"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border ${theme.borderPrimary} text-xs font-black ${theme.textSecondary} hover:bg-black/5 transition-colors`}
            >
              닫기
            </button>
            {onRequestCoffeeChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestCoffeeChat();
                }}
                className={`flex-1 py-2.5 rounded-xl ${theme.gradientButton} text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>커피챗 신청</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
