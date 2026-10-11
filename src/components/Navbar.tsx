import React from 'react';
import { Sparkles, Users, BookOpen, BarChart3, HeartHandshake, Coffee } from 'lucide-react';

export type AppTab = 'survey' | 'gatherings' | 'mymatches' | 'results' | 'directory' | 'dashboard' | 'roadmap';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  hasResults: boolean;
  matchCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, hasResults, matchCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('survey')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  OneTeam <span className="text-rose-600">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  SKMS 사내 동료 매칭
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                선택한 공통점 중심 블라인드 매칭 & One Team 협업 활성화
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                activeTab === 'survey'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>1. 매칭 신청 (설문)</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 relative ${
                activeTab === 'results'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>2. AI 추천 결과</span>
              {hasResults && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('mymatches')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                activeTab === 'mymatches'
                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>3. 내 매칭함</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                activeTab === 'directory'
                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-rose-500" />
              <span>동료 풀</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-rose-500" />
              <span>성과 대시보드</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === 'roadmap'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="6단계 개발 프롬프트 스튜디오"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>프롬프트 팩</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
