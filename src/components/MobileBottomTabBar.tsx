import React from 'react';
import { Coffee, Flame, HeartHandshake, Users } from 'lucide-react';
import { AppTab } from './Navbar';
import { useAppTheme } from '../theme/ThemeContext';

interface MobileBottomTabBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  hasResults?: boolean;
  matchCount?: number;
  gatheringCount?: number;
}

export const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  matchCount = 0,
  gatheringCount = 5,
}) => {
  const { theme } = useAppTheme();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 ${theme.bottomBarBg} backdrop-blur-lg border-t ${theme.borderPrimary} shadow-lg transition-colors`}>
      <div className="grid grid-cols-3 h-16 items-center px-4">
        {/* Tab 1: Matching Application Survey */}
        <button
          onClick={() => setActiveTab('survey')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'survey' || activeTab === 'results'
              ? `${theme.accentText} font-black`
              : `${theme.textMuted} hover:${theme.textSecondary}`
          }`}
        >
          <div className="relative">
            <Coffee className={`w-5 h-5 ${activeTab === 'survey' || activeTab === 'results' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[11px] mt-1 tracking-tight font-medium">1:1 매칭신청</span>
        </button>

        {/* Tab 2: Gathering & Lightning Meetups (NEW) */}
        <button
          onClick={() => setActiveTab('gatherings')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            activeTab === 'gatherings'
              ? `${theme.accentText} font-black`
              : `${theme.textMuted} hover:${theme.textSecondary}`
          }`}
        >
          <div className="relative">
            <Flame className={`w-5 h-5 ${activeTab === 'gatherings' ? 'stroke-[2.5] text-[#FF7A30]' : ''}`} />
            <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white text-[9px] font-black leading-tight ring-2 ring-white">
              {gatheringCount}
            </span>
          </div>
          <span className="text-[11px] mt-1 tracking-tight font-medium">소모임/번개</span>
        </button>

        {/* Tab 3: My Matches & Kakao Open Chats */}
        <button
          onClick={() => setActiveTab('mymatches')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            activeTab === 'mymatches'
              ? `${theme.accentText} font-black`
              : `${theme.textMuted} hover:${theme.textSecondary}`
          }`}
        >
          <div className="relative">
            <HeartHandshake className={`w-5 h-5 ${activeTab === 'mymatches' ? 'stroke-[2.5]' : ''}`} />
            {matchCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-[#FF7A30] text-white text-[9px] font-black leading-tight ring-2 ring-white">
                {matchCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight font-medium">내 매칭</span>
        </button>
      </div>
    </nav>
  );
};
