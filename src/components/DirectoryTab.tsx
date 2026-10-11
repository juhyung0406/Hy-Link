import React, { useState } from 'react';
import { ColleagueProfile } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Building, 
  MapPin, 
  UserPlus, 
  Briefcase, 
  X,
  Hash,
  Sparkles
} from 'lucide-react';
import { useAppTheme } from '../theme/ThemeContext';
import { WorkHistoryModal } from './WorkHistoryModal';
import { ImageEnlargeModal } from './ImageEnlargeModal';
import { COLLEAGUE_AVATARS } from '../data/mockColleagues';

interface DirectoryTabProps {
  candidates: ColleagueProfile[];
  onAddCandidate: (newCandidate: ColleagueProfile) => void;
  onSelectForMatching: (candidate: ColleagueProfile) => void;
}

export const DirectoryTab: React.FC<DirectoryTabProps> = ({
  candidates,
  onAddCandidate,
  onSelectForMatching,
}) => {
  const { theme } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Work History Modal state
  const [selectedColleagueForHistory, setSelectedColleagueForHistory] = useState<ColleagueProfile | null>(null);

  // Image Enlarge Modal state
  const [enlargedColleague, setEnlargedColleague] = useState<ColleagueProfile | null>(null);

  // New colleague form state
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('반도체공정개발팀');
  const [newTitle, setNewTitle] = useState('선임 엔지니어 (3년차)');
  const [newInterests, setNewInterests] = useState('핸드드립커피, 클라이밍');
  const [newHashtags, setNewHashtags] = useState('#열정엔지니어, #커피챗환영');
  const [newMbti, setNewMbti] = useState('ENFP');
  const [newLocation, setNewLocation] = useState('이천 SUPEX 센터 2층 라운지');

  const departments = ['ALL', ...Array.from(new Set(candidates.map((c) => c.department)))];

  const filteredCandidates = candidates.filter((cand) => {
    const matchesDept = selectedDept === 'ALL' || cand.department === selectedDept;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      cand.name.toLowerCase().includes(query) ||
      cand.department.toLowerCase().includes(query) ||
      cand.interests.some((i) => i.toLowerCase().includes(query)) ||
      (cand.hashtags && cand.hashtags.some((h) => h.toLowerCase().includes(query))) ||
      cand.skills.some((s) => s.toLowerCase().includes(query));
    return matchesDept && matchesSearch;
  });

  const handleCreateColleague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDept.trim()) return;

    const tags = newHashtags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newCandidate: ColleagueProfile = {
      id: `emp_${Date.now()}`,
      name: newName,
      department: newDept,
      division: '현업부서',
      jobTitle: newTitle,
      tenure: newTitle.includes('년차') ? newTitle : '3년차',
      avatar: COLLEAGUE_AVATARS.leeKm,
      interests: newInterests.split(',').map((s) => s.trim()).filter(Boolean),
      skills: ['One Team 협업', '사내 교류'],
      mbti: newMbti,
      cocValues: ['One Team', '상호 신뢰와 소통'],
      meetingPurposes: ['타부서 업무 교류', '취미 친구'],
      hashtags: tags.length > 0 ? tags : ['#사내동료', '#커피챗환영'],
      isWorkHistoryPublic: true,
      workHistory: [
        {
          period: '2023 ~ 현재',
          role: `${newDept} ${newTitle}`,
          description: '사내 주요 프로젝트 참여 및 타부서 협업 추진',
          tags: ['OneTeam', '프로젝트'],
        },
      ],
      preferredTimes: ['평일 점심시간', '퇴근 후 티타임'],
      location: newLocation,
    };

    onAddCandidate(newCandidate);
    setIsAddModalOpen(false);
    setNewName('');
    setNewInterests('');
    setNewHashtags('');
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Search & Filter Header Styled in App Theme */}
      <div className={`${theme.bgSurface} rounded-3xl border ${theme.borderPrimary} p-4 shadow-xs space-y-3 transition-colors`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.textPrimary}`}>
              사내 동료 탐색 ({candidates.length}명)
            </h2>
            <p className={`text-[11px] ${theme.textSecondary}`}>
              사진을 클릭하면 <span className="font-bold text-[#D86E38]">사진 확대 & 업무 히스토리</span>를 볼 수 있습니다
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl ${theme.gradientButton} text-white font-black text-xs shadow-xs transition-all flex items-center space-x-1 active:scale-95`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>동료 등록</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A8968C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 부서, 관심사, #해시태그 검색..."
            className={`w-full pl-9 pr-3.5 py-2.5 text-xs border ${theme.borderPrimary} rounded-xl ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070] transition-colors`}
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {departments.slice(0, 16).map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FFA070] to-[#F7824B] text-white shadow-2xs font-black'
                    : `${theme.bgSurfaceSecondary} ${theme.textSecondary} hover:bg-black/5 border border-transparent`
                }`}
              >
                {dept === 'ALL' ? '전체 부서' : dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colleague Cards Grid */}
      <div className="space-y-3">
        {filteredCandidates.map((cand) => {
          const hashtags = cand.hashtags || cand.interests.slice(0, 3).map((i) => `#${i}`);

          return (
            <div
              key={cand.id}
              data-demo-id={`colleague-card-${cand.id}`}
              className={`${theme.bgSurface} p-4 rounded-3xl border ${theme.borderPrimary} ${theme.cardShadow} transition-all space-y-3 hover:shadow-md`}
            >
              {/* Photo & Main Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Clickable Profile Photo: Enlarge Image */}
                  <div
                    onClick={() => setEnlargedColleague(cand)}
                    className="relative shrink-0 cursor-pointer active:scale-95 transition-transform group"
                    title="사진 클릭하여 크게 보기 (확대)"
                  >
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FFA070]/60 shadow-xs group-hover:border-[#FFA070] group-hover:scale-105 transition-all"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-2xs" />
                    {/* Zoom icon badge */}
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-md bg-[#5A3E36] text-white text-[8px] font-black shadow-2xs flex items-center space-x-0.5">
                      <span>🔍 확대</span>
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-black text-base ${theme.textPrimary} truncate`}>
                        {cand.name} TL
                      </h3>
                      {cand.mbti && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30 shrink-0">
                          {cand.mbti}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${theme.textSecondary} mt-0.5 font-medium truncate`}>
                      {cand.department} · {cand.jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-[#FFA070] shrink-0" />
                      <span className="truncate">{cand.location}</span>
                    </p>
                  </div>
                </div>

                {/* History Quick View Button */}
                <button
                  data-demo-id={`colleague-history-btn-${cand.id}`}
                  type="button"
                  onClick={() => setSelectedColleagueForHistory(cand)}
                  className="px-2.5 py-1 rounded-xl bg-[#FFF0E2] text-[#D86E38] hover:bg-[#FFE5D2] text-[11px] font-black border border-[#FFA070]/30 transition-all shrink-0 flex items-center space-x-1"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>이력 보기</span>
                </button>
              </div>

              {/* #Hashtags (No long bio narrative!) */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-[#FFF9F3] text-[#D86E38] text-xs font-black border border-[#FDE5D2]"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>

              {/* Connect / Coffee Chat CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {cand.preferredTimes?.[0] || '평일 점심시간 20~30분'}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectForMatching(cand)}
                  className={`px-3 py-1.5 rounded-xl ${theme.gradientButton} text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center space-x-1`}
                >
                  <span>커피챗 신청하기</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Work History Modal */}
      {selectedColleagueForHistory && (
        <WorkHistoryModal
          isOpen={!!selectedColleagueForHistory}
          onClose={() => setSelectedColleagueForHistory(null)}
          colleague={selectedColleagueForHistory}
        />
      )}

      {/* Image Enlarge Modal */}
      {enlargedColleague && (
        <ImageEnlargeModal
          isOpen={!!enlargedColleague}
          onClose={() => setEnlargedColleague(null)}
          imageUrl={enlargedColleague.avatar}
          name={enlargedColleague.name}
          department={enlargedColleague.department}
          jobTitle={enlargedColleague.jobTitle}
          mbti={enlargedColleague.mbti}
          hashtags={enlargedColleague.hashtags}
          location={enlargedColleague.location}
          onViewWorkHistory={() => {
            const target = enlargedColleague;
            setEnlargedColleague(null);
            setSelectedColleagueForHistory(target);
          }}
          onRequestCoffeeChat={() => {
            const target = enlargedColleague;
            setEnlargedColleague(null);
            onSelectForMatching(target);
          }}
        />
      )}

      {/* Add New Colleague Modal Styled in Theme */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className={`w-full max-w-md max-h-[90vh] ${theme.bgCanvas} rounded-3xl border ${theme.borderPrimary} shadow-2xl flex flex-col overflow-hidden`}>
            <div className={`px-5 py-4 ${theme.headerBg} border-b ${theme.borderPrimary} flex items-center justify-between`}>
              <h3 className={`text-base font-black ${theme.textPrimary}`}>
                새로운 동료 프로필 등록
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateColleague} className="flex-1 overflow-y-auto p-5 space-y-3.5">
              <div className="space-y-1">
                <label className={`text-xs font-black ${theme.textPrimary}`}>이름</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 송태욱"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-black ${theme.textPrimary}`}>소속 부서</label>
                <input
                  type="text"
                  required
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="예: 반도체공정개발팀"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className={`text-xs font-black ${theme.textPrimary}`}>직무 / 직급</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-black ${theme.textPrimary}`}>MBTI</label>
                  <input
                    type="text"
                    value={newMbti}
                    onChange={(e) => setNewMbti(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-black ${theme.textPrimary}`}>#해시태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={newHashtags}
                  onChange={(e) => setNewHashtags(e.target.value)}
                  placeholder="예: #열정엔지니어, #커피챗환영, #러닝크루"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-black ${theme.textPrimary}`}>취미 및 관심사 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={newInterests}
                  onChange={(e) => setNewInterests(e.target.value)}
                  placeholder="예: 핸드드립커피, 테니스, 클라이밍"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-black ${theme.textPrimary}`}>근무 위치</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${theme.borderPrimary} ${theme.bgSurfaceSecondary} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-2xl ${theme.gradientButton} text-white font-black text-xs shadow-md mt-2`}
              >
                동료 등록 완료
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
