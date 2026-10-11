import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  MessageCircle, 
  X,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { GatheringItem, UserProfile } from '../types';
import { useAppTheme } from '../theme/ThemeContext';

interface GatheringTabProps {
  gatherings: GatheringItem[];
  onAddGathering: (item: GatheringItem) => void;
  onJoinGathering: (gatheringId: string) => void;
  currentUser?: UserProfile;
}

export const GatheringTab: React.FC<GatheringTabProps> = ({
  gatherings,
  onAddGathering,
  onJoinGathering,
  currentUser,
}) => {
  const { theme } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeKakaoModal, setActiveKakaoModal] = useState<GatheringItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Gathering Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'dorm' | 'sports' | 'hobby' | 'coffee' | 'meal'>('dorm');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newMaxCount, setNewMaxCount] = useState<number>(4);
  const [newKakaoLink, setNewKakaoLink] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  const categories = [
    { id: 'all', label: '전체 보기', icon: '✨' },
    { id: 'dorm', label: '기숙사 번개', icon: '🏢' },
    { id: 'sports', label: '운동 / 스포츠', icon: '🎾' },
    { id: 'hobby', label: '취미 / 보드게임', icon: '🎲' },
    { id: 'meal', label: '맛집 / 식사', icon: '🍚' },
  ];

  const filteredGatherings = gatherings.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  const handleCopyKakaoLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    const tags = newTagInput
      .split(' ')
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    const categoryLabelMap = {
      dorm: '기숙사 번개',
      sports: '운동 / 스포츠',
      hobby: '취미 / 보드게임',
      coffee: '카페 / 티타임',
      meal: '맛집 / 식사',
    };

    const newItem: GatheringItem = {
      id: `g_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabelMap[newCategory],
      description: newDesc.trim() || '260928 동기들과 함께하는 편안한 모임입니다.',
      targetDate: newDate.trim(),
      location: newLocation.trim() || '이천 캠퍼스 기숙사 로비',
      creatorName: `${currentUser?.name || '신입'} TL`,
      creatorAvatar: currentUser?.avatar || 'https://via.placeholder.com/150',
      creatorMbti: currentUser?.mbti || 'ENFP',
      currentCount: 1,
      maxCount: Number(newMaxCount) || 4,
      kakaoLink: newKakaoLink.trim() || 'https://open.kakao.com/o/sHY2609Default',
      tags: tags.length > 0 ? tags : ['#260928동기', '#신입모임'],
      joinedMemberIds: ['my_id'],
      createdAt: '방금 전',
    };

    onAddGathering(newItem);
    setIsCreateModalOpen(false);
    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setNewLocation('');
    setNewKakaoLink('');
    setNewTagInput('');
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Compact Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-black text-[#5A3E36]">동기 소모임 & 번개</h2>
          <p className="text-[11px] text-slate-500">자유롭게 참여하거나 모임을 열어보세요.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-bold text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>모임 만들기</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => {
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-1 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E5D7C7] hover:bg-[#FAF3EB]'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gathering Cards List */}
      <div className="space-y-3">
        {filteredGatherings.map((item) => {
          const isFull = item.currentCount >= item.maxCount;
          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-3xl border border-[#E5D7C7] shadow-xs space-y-3 hover:shadow-md transition-all"
            >
              {/* Card Top: Category Label & Member Count */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/30">
                  {item.categoryLabel}
                </span>

                <div className="flex items-center space-x-1 text-xs">
                  <span className={`font-black ${isFull ? 'text-rose-600' : 'text-[#FF7A30]'}`}>
                    {item.currentCount} / {item.maxCount}명
                  </span>
                  <span className="text-[10px] text-slate-400">({item.createdAt})</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-black text-sm sm:text-base text-[#5A3E36] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Date & Location Pill */}
              <div className="p-2.5 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] text-xs text-slate-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#FFA070] shrink-0" />
                  <span className="font-bold text-[#5A3E36]">{item.targetDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FFA070] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E5D7C7] text-[#8C6D62]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Creator Info & Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={item.creatorAvatar}
                    alt={item.creatorName}
                    className="w-7 h-7 rounded-full object-cover border border-[#FFA070]"
                  />
                  <div>
                    <span className="text-xs font-black text-[#5A3E36] block">
                      {item.creatorName}
                    </span>
                    <span className="text-[9px] text-slate-400">모집 개설자</span>
                  </div>
                </div>

                {/* Join / Open Chat Button */}
                <button
                  type="button"
                  onClick={() => {
                    onJoinGathering(item.id);
                    setActiveKakaoModal(item);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all active:scale-95 shadow-xs ${
                    isFull
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white hover:brightness-105'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isFull ? '마감됨' : '참여 및 오픈채팅'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. KAKAO OPEN CHAT DIALOG MODAL */}
      {activeKakaoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E5D7C7] shadow-2xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-sm font-black text-xl">
              💬
            </div>

            <div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38]">
                참여 완료 🎉
              </span>
              <h3 className="font-black text-base text-[#5A3E36] mt-1.5">
                카카오톡 오픈채팅방 연결
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                [{activeKakaoModal.title}] 모임에 참여하셨습니다! 동기들과 오픈채팅방에서 인사하세요.
              </p>
            </div>

            {/* Kakao Open Chat Link Box */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1.5">
              <span className="text-[10px] font-bold text-amber-900 block">
                공식 오픈채팅방 링크
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 break-all select-all">
                {activeKakaoModal.kakaoLink}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopyKakaoLink(activeKakaoModal.kakaoLink)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>링크 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>카카오톡 링크 복사하기</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveKakaoModal(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE GATHERING MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] bg-white rounded-3xl border border-[#E5D7C7] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF4ED] border-b border-[#E5D7C7] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#FF7A30]" />
                <h3 className="font-black text-base text-[#5A3E36]">
                  새로운 동기 번개 / 소모임 개설
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">모임 카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
                >
                  <option value="dorm">🏢 기숙사 번개 (치맥/야식/수다)</option>
                  <option value="sports">🎾 운동 / 스포츠 (테니스/배드민턴/러닝)</option>
                  <option value="hobby">🎲 취미 / 보드게임 (카페/루미큐브)</option>
                  <option value="meal">🍚 맛집 / 식사 (이천쌀밥/고기)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">모임 제목</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 오늘 저녁 기숙사 앞 가벼운 치맥 번개!"
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">모임 상세 설명</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="어떤 동기들과 무엇을 하고 싶은지 편하게 적어주세요."
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-[#5A3E36] mb-1">모임 일시</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="예: 오늘 20:00"
                    className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#5A3E36] mb-1">모집 정원</label>
                  <select
                    value={newMaxCount}
                    onChange={(e) => setNewMaxCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
                  >
                    {[2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={num}>{num}명</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">만날 장소</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="예: 기숙사 C동 1층 로비 / SUPEX 북카페"
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
                />
              </div>

              {/* Kakao Open Chat URL */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
                  카카오톡 오픈채팅방 링크 (참여자 소통용)
                </label>
                <input
                  type="text"
                  value={newKakaoLink}
                  onChange={(e) => setNewKakaoLink(e.target.value)}
                  placeholder="https://open.kakao.com/o/..."
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-mono text-slate-800"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-black text-[#5A3E36] mb-1">#해시태그 (띄어쓰기 구분)</label>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="#기숙사 #치맥 #테니스"
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>소모임 / 번개 등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
