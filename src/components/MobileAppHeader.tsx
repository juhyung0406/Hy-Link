import React from 'react';
import { User } from 'lucide-react';
import { AppTab } from './Navbar';
import { useAppTheme } from '../theme/ThemeContext';
import { HyLinkLogo } from './HyLinkLogo';
import { UserProfile } from '../types';
import { MASCOT_AVATARS } from '../data/mockGatherings';

interface MobileAppHeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser?: UserProfile;
  unreadCount?: number;
  onOpenMyPage: () => void;
  onOpenAdminPortal?: () => void;
  onOpenDemo?: () => void;
}

export const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadCount = 0,
  onOpenMyPage,
  onOpenDemo,
}) => {
  const { theme } = useAppTheme();

  const userAvatar = currentUser?.avatar || MASCOT_AVATARS.haru;

  return (
    <header className={`sticky top-0 z-40 ${theme.headerBg} border-b ${theme.borderPrimary} px-4 py-2.5 flex items-center justify-between transition-colors`}>
      {/* Brand: Hy-Link Logo */}
      <div 
        onClick={() => setActiveTab('survey')}
        className="cursor-pointer active:scale-95 transition-transform"
      >
        <HyLinkLogo size="sm" showSubtitle={true} />
      </div>

      {/* Right Actions: MyPage Button Only (Clean & Focused) */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30 hidden xs:inline">
          260928 동기
        </span>

        {/* Top-Right: MyPage (마이페이지) Button */}
        <button
          onClick={onOpenMyPage}
          className="flex items-center space-x-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-[#FFF0E2] hover:bg-[#FFE5D2] border border-[#FAD6BC] transition-all shadow-2xs active:scale-95"
          title="마이페이지 (프로필 및 설정)"
        >
          <img
            src={userAvatar}
            alt="My Avatar"
            className="w-6 h-6 rounded-full object-cover border border-[#FFA070]"
          />
          <span className="text-[11px] font-black text-[#5A3E36]">
            마이
          </span>
        </button>
      </div>
    </header>
  );
};
