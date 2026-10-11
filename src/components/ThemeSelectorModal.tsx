import React from 'react';
import { Palette, Check, X } from 'lucide-react';
import { THEMES, ThemeId, useAppTheme } from '../theme/ThemeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { themeId, setThemeId, theme } = useAppTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className={`w-full max-w-md ${theme.bgSurface} ${theme.textPrimary} border-t sm:border ${theme.borderPrimary} rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-2xl ${theme.gradientButton} text-white flex items-center justify-center shadow-xs`}>
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">
                Hy-Link 테마 버전 선택
              </h3>
              <p className={`text-[11px] ${theme.textMuted}`}>
                로고 무드를 살린 3가지 디자인 버전을 비교해 보세요
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Theme List */}
        <div className="space-y-2.5">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const t = THEMES[id];
            const isSelected = themeId === id;

            return (
              <button
                key={id}
                onClick={() => setThemeId(id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? `border-[#FFA070] ring-2 ring-[#FFA070]/30 ${t.bgSurfaceSecondary}`
                    : `border-slate-200/60 hover:bg-slate-50`
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Swatch preview */}
                  <div className="flex -space-x-1 shrink-0">
                    <span 
                      className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                      style={{
                        background: id === 'hylink-warm' 
                          ? 'linear-gradient(135deg, #FFA070 0%, #F7824B 100%)' 
                          : id === 'hylink-cream' 
                          ? '#FFA579' 
                          : '#5A3E36'
                      }}
                    />
                    <span 
                      className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                      style={{
                        background: id === 'hylink-warm' 
                          ? '#FAF3EB' 
                          : id === 'hylink-cream' 
                          ? '#FCF7F0' 
                          : '#F7EFE6'
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-xs sm:text-sm">
                        {t.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] font-extrabold">
                        {t.versionLabel}
                      </span>
                    </div>
                    <p className={`text-[11px] ${theme.textSecondary} mt-0.5 leading-snug`}>
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className={`w-6 h-6 rounded-full ${t.gradientButton} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-2xl ${theme.gradientButton} text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]`}
        >
          선택한 테마로 계속하기
        </button>
      </div>
    </div>
  );
};
