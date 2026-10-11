import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Unlock, 
  Save, 
  Check, 
  Upload, 
  Camera, 
  MessageCircle, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  EyeOff,
  Hash,
  AlertCircle
} from 'lucide-react';
import { UserProfile, PrivacySettings } from '../types';
import { useAppTheme } from '../theme/ThemeContext';
import { MASCOT_AVATARS } from '../data/mockGatherings';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onOpenAdminPortal?: () => void;
  onLogout: () => void;
}

const MASCOT_PRESETS = [
  { id: 'haru', label: '하루 (단정/친근)', url: MASCOT_AVATARS.haru },
  { id: 'haruDevil', label: '하루 악마 (장난/활기)', url: MASCOT_AVATARS.haruDevil },
  { id: 'habeam', label: '하빔이 (스마트/하이테크)', url: MASCOT_AVATARS.habeam },
];

const MBTI_LIST = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const QUICK_TAG_PRESETS = [
  '#ENFP',
  '#테니스',
  '#헬스',
  '#커피마실사람',
  '#러닝크루',
  '#보드게임',
  '#기숙사동기',
  '#맛집탐방',
  '#원팀마인드',
  '#주말취미',
];

export const MyPageModal: React.FC<MyPageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onOpenAdminPortal,
  onLogout,
}) => {
  const { theme } = useAppTheme();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '010-8292-2609');
  const [avatar, setAvatar] = useState(currentUser.avatar || MASCOT_AVATARS.haru);
  const [mbti, setMbti] = useState(currentUser.mbti || 'ENFP');
  const [hashtags, setHashtags] = useState<string[]>(
    currentUser.hashtags && currentUser.hashtags.length > 0
      ? currentUser.hashtags
      : ['#ENFP', '#테니스', '#커피마실사람']
  );
  const [customTagInput, setCustomTagInput] = useState('');
  const [kakaoOpenChatUrl, setKakaoOpenChatUrl] = useState(
    currentUser.kakaoOpenChatUrl || 'https://open.kakao.com/o/sHY2609Sky'
  );

  // Granular Privacy Settings
  const [privacy, setPrivacy] = useState<PrivacySettings>(
    currentUser.privacySettings || {
      isNamePublic: true,
      isAvatarPublic: true,
      isMbtiPublic: true,
      isInterestsPublic: true,
      isHashtagsPublic: true,
      isPhonePublic: false,
    }
  );

  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '010-8292-2609');
      setAvatar(currentUser.avatar || MASCOT_AVATARS.haru);
      setMbti(currentUser.mbti || 'ENFP');
      setHashtags(currentUser.hashtags || ['#ENFP', '#테니스', '#커피마실사람']);
      setKakaoOpenChatUrl(currentUser.kakaoOpenChatUrl || '');
      if (currentUser.privacySettings) {
        setPrivacy(currentUser.privacySettings);
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Custom photo file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHashtag = (tag: string) => {
    if (hashtags.includes(tag)) {
      setHashtags(hashtags.filter((t) => t !== tag));
    } else {
      if (hashtags.length < 5) {
        setHashtags([...hashtags, tag]);
      }
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('#')) trimmed = `#${trimmed}`;
    if (!hashtags.includes(trimmed)) {
      if (hashtags.length < 5) {
        setHashtags([...hashtags, trimmed]);
      }
    }
    setCustomTagInput('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      phone: phone.trim(),
      department: '미배치 (10/14 부서배치 예정)',
      jobTitle: 'TL (26.09 신입)',
      tenure: '1년차 (26.09 입사)',
      avatar,
      mbti,
      hashtags,
      kakaoOpenChatUrl: kakaoOpenChatUrl.trim(),
      privacySettings: privacy,
    };

    onSaveProfile(updated);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] bg-[#FAF4ED] text-slate-800 rounded-3xl border border-[#E5D7C7] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E5D7C7] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">👤</span>
            <div>
              <h2 className="text-base font-black text-[#5A3E36]">
                마이페이지 & 프로필 설정
              </h2>
              <p className="text-[11px] text-slate-400">
                260928 신입 구성원 전용 · 개별 정보 비공개 지원
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
          
          {/* 1. Profile Photo & Mascots */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C7] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-[#5A3E36]">프로필 사진 설정</span>
              <button
                type="button"
                onClick={() => setPrivacy((p) => ({ ...p, isAvatarPublic: !p.isAvatarPublic }))}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 border transition-all ${
                  privacy.isAvatarPublic 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {privacy.isAvatarPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{privacy.isAvatarPublic ? '사진 공개 중' : '사진 비공개'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FFA070] shadow-sm"
                />
                {!privacy.isAvatarPublic && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[8px] font-black">
                    비공개
                  </span>
                )}
              </div>

              {/* Upload my own photo */}
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#5A3E36] hover:bg-[#48312B] text-white font-bold text-[11px] cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>내 사진 직접 업로드</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">
                  자신의 사진을 올리거나 아래 사내 마스코트 중 선택하세요.
                </p>
              </div>
            </div>

            {/* Mascot Presets */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
                SK하이닉스 캐릭터 아바타 선택:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {MASCOT_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAvatar(m.url)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center space-y-1 transition-all ${
                      avatar === m.url
                        ? 'border-[#FF7A30] bg-[#FFF0E2] ring-1 ring-[#FF7A30]/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={m.url} alt={m.label} className="w-11 h-11 rounded-lg object-cover" />
                    <span className="text-[9px] font-bold text-slate-700 truncate">{m.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Basic Information (Locked Dept & Tenure) */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C7] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-black text-xs text-[#5A3E36]">기본 인적사항</span>
              <span className="text-[10px] text-[#D86E38] font-bold">260928 신입 기수</span>
            </div>

            {/* Name Field + Privacy Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#5A3E36]">이름 (실명/닉네임)</label>
                <button
                  type="button"
                  onClick={() => setPrivacy((p) => ({ ...p, isNamePublic: !p.isNamePublic }))}
                  className="text-[10px] text-slate-400 hover:text-[#D86E38] flex items-center space-x-0.5"
                >
                  {privacy.isNamePublic ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                  <span>{privacy.isNamePublic ? '이름 공개' : '이름 비공개'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
              />
            </div>

            {/* Department (LOCKED) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#5A3E36] flex items-center space-x-1">
                  <span>소속 부서</span>
                  <Lock className="w-3 h-3 text-amber-600" />
                </label>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  배치 전 잠금
                </span>
              </div>
              <input
                type="text"
                disabled
                value="미배치 (10/14 부서배치 예정)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400">
                * 10월 14일 정식 부서배치 후 시스템에서 자동으로 연동됩니다.
              </p>
            </div>

            {/* Job Title & Tenure (LOCKED to 1년차 TL) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-[#5A3E36]">직무 호칭</label>
                <input
                  type="text"
                  disabled
                  value="TL (26.09 신입)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-[#5A3E36]">입사 연차</label>
                <input
                  type="text"
                  disabled
                  value="1년차 (26.09 입사)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* 3. Kakao Open Chat URL (For matched communication) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-black text-xs">
              <MessageCircle className="w-4 h-4 text-amber-700" />
              <span>카카오톡 오픈채팅방 링크 (매칭 시 공유)</span>
            </div>
            <p className="text-[10px] text-amber-800 leading-relaxed">
              1:1 매칭이나 소모임 성사 시 서로 연락할 수 있는 1:1 카카오 오픈채팅 링크를 입력해두세요.
            </p>
            <input
              type="text"
              value={kakaoOpenChatUrl}
              onChange={(e) => setKakaoOpenChatUrl(e.target.value)}
              placeholder="https://open.kakao.com/o/..."
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono text-xs text-slate-800"
            />
          </div>

          {/* 4. MBTI */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C7] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-[#5A3E36]">MBTI 성향</span>
              <button
                type="button"
                onClick={() => setPrivacy((p) => ({ ...p, isMbtiPublic: !p.isMbtiPublic }))}
                className="text-[10px] text-slate-400 hover:text-[#D86E38] flex items-center space-x-0.5"
              >
                {privacy.isMbtiPublic ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                <span>{privacy.isMbtiPublic ? '공개' : '비공개'}</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {MBTI_LIST.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMbti(m)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mbti === m
                      ? 'bg-[#FF7A30] text-white shadow-xs'
                      : 'bg-[#FAF4ED] text-slate-600 hover:bg-[#F4ECE3]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 5. #Hashtags (Intuitive Keywords) */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C7] space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-[#5A3E36] flex items-center space-x-1">
                <Hash className="w-3.5 h-3.5 text-[#FF7A30]" />
                <span>나를 표현하는 #키워드 (최대 5개)</span>
              </span>
              <span className="text-[10px] font-bold text-[#D86E38] bg-[#FFF0E2] px-2 py-0.5 rounded-full">
                {hashtags.length}/5
              </span>
            </div>

            {/* Custom Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="#직접입력 (예: #헬스)"
                className="flex-1 px-3 py-2 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={() => handleAddCustomTag()}
                className="px-3 py-2 rounded-xl bg-[#5A3E36] text-white font-bold text-xs shrink-0"
              >
                추가
              </button>
            </div>

            {/* Selected Hashtags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-xl text-xs font-black bg-[#FF7A30] text-white shadow-2xs flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => toggleHashtag(tag)}>
                    <X className="w-3 h-3 text-white/80 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                추천 키워드 (터치하여 추가):
              </span>
              <div className="flex flex-wrap gap-1">
                {QUICK_TAG_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleHashtag(t)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF4ED] hover:bg-[#F4ECE3] text-slate-700 border border-[#E5D7C7]"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Portal Entry & Logout */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            {onOpenAdminPortal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminPortal();
                }}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>관리자 제어 센터</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 ml-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E5D7C7] flex items-center space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1"
          >
            {isSavedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>저장 완료!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>프로필 설정 저장하기</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
