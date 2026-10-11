import React, { useState } from 'react';
import { Plus, X, Check, Sparkles } from 'lucide-react';
import { INTEREST_CATEGORIES, InterestCategory } from '../data/interestCategories';
import { useAppTheme } from '../theme/ThemeContext';

interface CategorizedInterestSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  maxSelections?: number;
  label?: string;
  helperText?: string;
}

export const CategorizedInterestSelector: React.FC<CategorizedInterestSelectorProps> = ({
  selectedInterests,
  onChange,
  maxSelections = 6,
  label = '취미 및 관심사',
  helperText = '대분류 탭을 누르고 다양한 관심사를 골라보세요. 직접 입력도 가능합니다.',
}) => {
  const { theme } = useAppTheme();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(INTEREST_CATEGORIES[0].id);
  const [customInput, setCustomInput] = useState('');

  const currentCategory =
    INTEREST_CATEGORIES.find((c) => c.id === activeCategoryId) || INTEREST_CATEGORIES[0];

  const handleToggle = (item: string) => {
    if (selectedInterests.includes(item)) {
      onChange(selectedInterests.filter((i) => i !== item));
    } else {
      if (selectedInterests.length < maxSelections) {
        onChange([...selectedInterests, item]);
      }
    }
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      if (selectedInterests.length < maxSelections) {
        onChange([...selectedInterests, trimmed]);
      }
    }
    setCustomInput('');
  };

  const handleRemove = (item: string) => {
    onChange(selectedInterests.filter((i) => i !== item));
  };

  return (
    <div className="space-y-3.5">
      {/* Label and Count */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-xs font-black ${theme.textPrimary} block`}>{label}</span>
          {helperText && <p className={`text-[11px] ${theme.textMuted} mt-0.5`}>{helperText}</p>}
        </div>
        <span
          className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
            selectedInterests.length >= maxSelections
              ? 'bg-amber-100 text-amber-800'
              : 'bg-[#FFF0E2] text-[#D86E38]'
          }`}
        >
          {selectedInterests.length}/{maxSelections}
        </span>
      </div>

      {/* Selected Tags Display */}
      {selectedInterests.length > 0 && (
        <div className={`p-3 rounded-2xl ${theme.bgSurfaceSecondary} border ${theme.borderPrimary} flex flex-wrap gap-1.5 items-center`}>
          <span className={`text-[10px] font-bold ${theme.textMuted} mr-1 flex items-center space-x-1`}>
            <Sparkles className="w-3 h-3 text-[#FFA070]" />
            <span>선택됨:</span>
          </span>
          {selectedInterests.map((item) => (
            <span
              key={item}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#D86E38] border border-[#FFA070]/30 shadow-2xs group"
            >
              <span>#{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="w-3.5 h-3.5 rounded-full hover:bg-black/5 flex items-center justify-center text-slate-400 hover:text-red-500"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Direct Input Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="원하는 관심사를 직접 입력해보세요 (예: 패러글라이딩)"
            className={`w-full px-3.5 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurface} ${theme.textPrimary} placeholder:${theme.textMuted} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddCustom()}
          disabled={!customInput.trim() || selectedInterests.length >= maxSelections}
          className="px-3.5 py-2 rounded-xl bg-[#5A3E36] hover:bg-[#48312B] disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>직접 추가</span>
        </button>
      </div>

      {/* Broad Categories Grid (좌우 스크롤 없이 한눈에 선택하는 6대 카테고리) */}
      <div className="space-y-1.5">
        <span className={`text-[11px] font-bold ${theme.textMuted} block`}>
          관심 카테고리를 터치해 보세요
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {INTEREST_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center space-y-0.5 text-center active:scale-95 border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white border-transparent shadow-xs'
                    : 'bg-white text-slate-700 border-[#E5D7C7] hover:border-[#FFA070]/60 hover:bg-[#FFF9F5]'
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span className="text-[11px] truncate">{cat.name.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories (소분류 그리드/칩스) */}
      <div className={`p-3.5 rounded-2xl ${theme.bgSurface} border ${theme.borderPrimary} min-h-[110px]`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold ${theme.textMuted}`}>
            {currentCategory.icon} {currentCategory.name} 소분류 ({currentCategory.subcategories.length}개)
          </span>
          <span className="text-[10px] text-slate-400">클릭하여 선택/해제</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentCategory.subcategories.map((sub) => {
            const isSelected = selectedInterests.includes(sub);
            return (
              <button
                key={sub}
                data-demo-id={`survey-interest-${sub}`}
                type="button"
                onClick={() => handleToggle(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-[#FFF0E2] text-[#D86E38] font-black border border-[#FFA070] shadow-2xs'
                    : `${theme.bgSurfaceSecondary} ${theme.textSecondary} hover:bg-black/5 border border-transparent`
                }`}
              >
                <span>#{sub}</span>
                {isSelected && <Check className="w-3 h-3 text-[#FFA070] stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
