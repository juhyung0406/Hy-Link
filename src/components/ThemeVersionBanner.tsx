import React from 'react';
import { THEMES, ThemeId, useAppTheme } from '../theme/ThemeContext';
import { Sparkles, Check } from 'lucide-react';

export const ThemeVersionBanner: React.FC = () => {
  const { themeId, setThemeId } = useAppTheme();

  const versions: { id: ThemeId; label: string; badge: string; color: string }[] = [
    { 
      id: 'hylink-warm', 
      label: '버전 A. 웜 버터', 
      badge: '로고 컬러',
      color: 'bg-gradient-to-r from-[#FFA070] to-[#F7824B]'
    },
    { 
      id: 'hylink-cream', 
      label: '버전 B. 바닐라 라떼', 
      badge: '밝은 톤',
      color: 'bg-[#FFA579]'
    },
    { 
      id: 'hylink-mocha', 
      label: '버전 C. 딥 모카', 
      badge: '모카 톤',
      color: 'bg-[#5A3E36]'
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 border border-[#FFA070]/30 shadow-xs mb-3 space-y-1.5">
      <div className="flex items-center justify-between px-1 text-[11px]">
        <span className="font-extrabold text-[#5A3E36] flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FFA070]" />
          <span>Hy-Link 테마 버전:</span>
        </span>
        <span className="text-[10px] text-[#D86E38] font-semibold">
          탭하여 바로 비교해 보세요
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {versions.map((v) => {
          const isSelected = themeId === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setThemeId(v.id)}
              className={`py-2 px-1.5 rounded-xl text-center transition-all relative flex flex-col items-center justify-center border ${
                isSelected
                  ? 'bg-[#FFF0E2] border-[#FFA070] text-[#5A3E36] font-black shadow-xs ring-1 ring-[#FFA070]/40'
                  : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/60 text-slate-600 font-bold'
              }`}
            >
              {/* Dot swatch */}
              <div className="flex items-center space-x-1 mb-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${v.color} inline-block shadow-2xs`} />
                {isSelected && <Check className="w-2.5 h-2.5 text-[#D86E38] stroke-[3]" />}
              </div>
              <span className="text-[11px] leading-tight block truncate w-full">
                {v.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
