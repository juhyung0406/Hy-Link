import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeId = 'hylink-warm' | 'hylink-cream' | 'hylink-mocha';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  versionLabel: string;
  subtitle: string;
  tagline: string;
  bgCanvas: string;
  bgSurface: string;
  bgSurfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentText: string;
  borderPrimary: string;
  borderSecondary: string;
  badgeBg: string;
  badgeText: string;
  headerBg: string;
  bottomBarBg: string;
  gradientButton: string;
  gradientBorder: string;
  sparkColor: string;
  cardShadow: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'hylink-warm': {
    id: 'hylink-warm',
    name: 'Hy-Link 웜 버터 & 모카',
    versionLabel: '버전 A (기본)',
    subtitle: '로고 기반 부드러운 버터크림 캔버스 & 모카 브라운',
    tagline: '따뜻한 연결, 기분 좋은 커피챗',
    bgCanvas: 'bg-[#FAF3EB]',
    bgSurface: 'bg-[#FFFEFC]',
    bgSurfaceSecondary: 'bg-[#F4ECE3]',
    textPrimary: 'text-[#4D352D]',
    textSecondary: 'text-[#7A645A]',
    textMuted: 'text-[#A8968C]',
    accent: 'bg-[#FF9E6C]',
    accentHover: 'hover:bg-[#F28B57]',
    accentLight: 'bg-[#FFF2E7]',
    accentText: 'text-[#D86E38]',
    borderPrimary: 'border-[#EFE3D5]',
    borderSecondary: 'border-[#E5D7C7]',
    badgeBg: 'bg-[#FFF0E2]',
    badgeText: 'text-[#D86E38]',
    headerBg: 'bg-[#FAF3EB]/95 backdrop-blur-md',
    bottomBarBg: 'bg-[#FAF3EB]/95 backdrop-blur-md',
    gradientButton: 'bg-gradient-to-r from-[#FFA070] to-[#F7824B]',
    gradientBorder: 'from-[#FFA070] to-[#5A3E36]',
    sparkColor: '#FFA070',
    cardShadow: 'shadow-[0_4px_20px_-2px_rgba(90,62,54,0.06)]',
  },
  'hylink-cream': {
    id: 'hylink-cream',
    name: '소프트 바닐라 라떼',
    versionLabel: '버전 B',
    subtitle: '포근하고 밝은 바닐라 아이보리 & 피치 악센트',
    tagline: '부담 없는 사내 티타임',
    bgCanvas: 'bg-[#FCF7F0]',
    bgSurface: 'bg-white',
    bgSurfaceSecondary: 'bg-[#F8F1E7]',
    textPrimary: 'text-[#3E2C24]',
    textSecondary: 'text-[#6E5950]',
    textMuted: 'text-[#9E8B82]',
    accent: 'bg-[#FFA579]',
    accentHover: 'hover:bg-[#F5915F]',
    accentLight: 'bg-[#FFF5ED]',
    accentText: 'text-[#E0723A]',
    borderPrimary: 'border-[#EDE2D4]',
    borderSecondary: 'border-[#E2D4C3]',
    badgeBg: 'bg-[#FFF4EC]',
    badgeText: 'text-[#D86E38]',
    headerBg: 'bg-[#FCF7F0]/95 backdrop-blur-md',
    bottomBarBg: 'bg-[#FCF7F0]/95 backdrop-blur-md',
    gradientButton: 'bg-gradient-to-r from-[#FFA579] to-[#F8874E]',
    gradientBorder: 'from-[#FFA579] to-[#E0723A]',
    sparkColor: '#FFA579',
    cardShadow: 'shadow-[0_4px_16px_-2px_rgba(62,44,36,0.05)]',
  },
  'hylink-mocha': {
    id: 'hylink-mocha',
    name: '딥 모카 초콜릿',
    versionLabel: '버전 C',
    subtitle: '단단하고 세련된 모카 브라운 버튼 & 크림 카드',
    tagline: '신뢰와 온기가 있는 One Team',
    bgCanvas: 'bg-[#F7EFE6]',
    bgSurface: 'bg-[#FFFEFC]',
    bgSurfaceSecondary: 'bg-[#EFE4D8]',
    textPrimary: 'text-[#3B2822]',
    textSecondary: 'text-[#634E45]',
    textMuted: 'text-[#948177]',
    accent: 'bg-[#5A3E36]',
    accentHover: 'hover:bg-[#48312B]',
    accentLight: 'bg-[#FFF0E2]',
    accentText: 'text-[#5A3E36]',
    borderPrimary: 'border-[#EADCCF]',
    borderSecondary: 'border-[#DDCBBD]',
    badgeBg: 'bg-[#FFF0E2]',
    badgeText: 'text-[#D86E38]',
    headerBg: 'bg-[#F7EFE6]/95 backdrop-blur-md',
    bottomBarBg: 'bg-[#F7EFE6]/95 backdrop-blur-md',
    gradientButton: 'bg-[#5A3E36]',
    gradientBorder: 'from-[#5A3E36] to-[#FFA070]',
    sparkColor: '#FFA070',
    cardShadow: 'shadow-[0_4px_20px_-2px_rgba(59,40,34,0.08)]',
  },
};

interface ThemeContextType {
  theme: ThemeConfig;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES['hylink-warm'],
  themeId: 'hylink-warm',
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>('hylink-warm');

  return (
    <ThemeContext.Provider
      value={{
        theme: THEMES[themeId],
        themeId,
        setThemeId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
