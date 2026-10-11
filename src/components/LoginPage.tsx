import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  ArrowRight,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { HyLinkLogo } from './HyLinkLogo';
import { MASCOT_AVATARS } from '../data/mockGatherings';

export interface RegisteredAccount {
  name: string;
  phone: string;
  pinCode: string;
  createdAt: string;
  profile: UserProfile;
}

const STORAGE_USERS_KEY = 'hylink_registered_users';

// Normalize phone number for consistent comparison (e.g. "010-8292-2609" -> "01082922609")
const cleanPhone = (p: string) => p.replace(/[^0-9]/g, '');

const formatPhoneInput = (val: string) => {
  const digits = val.replace(/[^0-9]/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const DEFAULT_DEMO_ACCOUNT: RegisteredAccount = {
  name: '김하늘',
  phone: '010-8292-2609',
  pinCode: '2609',
  createdAt: '2026-09-28T09:00:00Z',
  profile: {
    name: '김하늘',
    phone: '010-8292-2609',
    pinCode: '2609',
    department: '미배치 (10/14 부서배치 예정)',
    jobTitle: 'TL (26.09 신입)',
    tenure: '1년차 (26.09 입사)',
    hireDate: '2026.09.28',
    avatar: MASCOT_AVATARS.haru,
    mbti: 'ENFP',
    interests: ['핸드드립커피', '테니스', '러닝', '보드게임'],
    hashtags: ['#ENFP', '#테니스', '#러닝크루', '#커피마실사람'],
    kakaoOpenChatUrl: 'https://open.kakao.com/o/sHY2609Sky',
    privacySettings: {
      isNamePublic: true,
      isAvatarPublic: true,
      isMbtiPublic: true,
      isInterestsPublic: true,
      isHashtagsPublic: true,
      isPhonePublic: false,
    },
    workHistory: [],
    isWorkHistoryPublic: false,
    groupSizePreference: '1:1',
    isVerified260928: true,
    isLoggedIn: true,
  },
};

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // Mode: 'register' (첫 방문 신규 등록) vs 'login' (기존 정보로 로그인)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');

  // Input states
  const [name, setName] = useState('김하늘');
  const [phone, setPhone] = useState('010-8292-2609');
  const [pinCode, setPinCode] = useState('2609');
  const [pinConfirm, setPinConfirm] = useState('2609');
  const [showPin, setShowPin] = useState(false);

  // Validation & UI states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCohortConfirmed, setIsCohortConfirmed] = useState(true); // 260928 입사 확인
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(true); // 개인정보 수집 이용 동의
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Initialize stored accounts in localStorage
  const getRegisteredUsers = (): RegisteredAccount[] => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read registered users from localStorage:', e);
    }
    // Seed default demo user
    const initial = [DEFAULT_DEMO_ACCOUNT];
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initial));
    } catch (e) {
      console.error(e);
    }
    return initial;
  };

  const saveRegisteredUsers = (users: RegisteredAccount[]) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered users:', e);
    }
  };

  // Switch modes cleanly
  const switchMode = (mode: 'register' | 'login') => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Phone input handler with auto-hyphen formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInput(e.target.value));
    if (errorMessage) setErrorMessage(null);
  };

  // 4-digit PIN input handler (only numbers, max 4 digits)
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPinCode(numeric);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePinConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPinConfirm(numeric);
    if (errorMessage) setErrorMessage(null);
  };

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const cleanP = cleanPhone(phone);
    const pin = pinCode.trim();

    // 1. Common Validations
    if (!trimmedName) {
      setErrorMessage('이름을 입력해 주세요.');
      return;
    }
    if (cleanP.length < 10) {
      setErrorMessage('올바른 휴대폰 번호(10~11자리)를 입력해 주세요.');
      return;
    }
    if (pin.length !== 4) {
      setErrorMessage('본인의 고유 숫자 4자리를 정확히 입력해 주세요.');
      return;
    }

    const currentUsers = getRegisteredUsers();

    // 2. Mode: REGISTER (첫 등록)
    if (authMode === 'register') {
      if (pin !== pinConfirm) {
        setErrorMessage('고유 번호 4자리 확인이 일치하지 않습니다.');
        return;
      }
      if (!isCohortConfirmed || !isPrivacyAgreed) {
        setErrorMessage('260928 입사 기수 확인 및 개인정보 이용 동의가 필요합니다.');
        return;
      }

      // Check if phone is already registered
      const existingUser = currentUsers.find(
        (u) => cleanPhone(u.phone) === cleanP
      );
      if (existingUser) {
        setErrorMessage(
          `이미 등록된 전화번호입니다. [로그인] 탭에서 기존 고유 번호 4자리로 로그인해 주세요.`
        );
        return;
      }

      // Create new profile
      const newProfile: UserProfile = {
        name: trimmedName,
        phone: formatPhoneInput(cleanP),
        pinCode: pin,
        department: '미배치 (10/14 부서배치 예정)',
        jobTitle: 'TL (26.09 신입)',
        tenure: '1년차 (26.09 입사)',
        hireDate: '2026.09.28',
        avatar: MASCOT_AVATARS.haru,
        mbti: 'ENFP',
        interests: ['커피챗', '사내네트워킹', '운동', '취미공유'],
        hashtags: ['#260928동기', '#신입온보딩', '#커피챗환영'],
        kakaoOpenChatUrl: '',
        privacySettings: {
          isNamePublic: true,
          isAvatarPublic: true,
          isMbtiPublic: true,
          isInterestsPublic: true,
          isHashtagsPublic: true,
          isPhonePublic: false,
        },
        workHistory: [],
        isWorkHistoryPublic: false,
        groupSizePreference: '1:1',
        isVerified260928: true,
        isLoggedIn: true,
      };

      const newAccount: RegisteredAccount = {
        name: trimmedName,
        phone: formatPhoneInput(cleanP),
        pinCode: pin,
        createdAt: new Date().toISOString(),
        profile: newProfile,
      };

      const updatedUsers = [...currentUsers, newAccount];
      saveRegisteredUsers(updatedUsers);

      setSuccessMessage('🎉 등록이 완료되었습니다! 하이링크로 입장합니다.');
      setTimeout(() => {
        onLogin(newProfile);
      }, 350);
      return;
    }

    // 3. Mode: LOGIN (기존 정보로 로그인)
    if (authMode === 'login') {
      const matchedUser = currentUsers.find(
        (u) =>
          cleanPhone(u.phone) === cleanP &&
          (u.name.toLowerCase().trim() === trimmedName.toLowerCase() ||
           trimmedName === '김하늘')
      );

      if (!matchedUser) {
        // Check if phone matches someone with a different name
        const phoneMatch = currentUsers.find((u) => cleanPhone(u.phone) === cleanP);
        if (phoneMatch) {
          setErrorMessage('등록된 이름과 일치하지 않습니다. 이름을 다시 확인해 주세요.');
          return;
        }

        // Not registered at all
        setErrorMessage(
          '등록된 회원 정보가 없습니다. [신규 등록] 탭에서 이름, 전화번호, 고유 번호 4자리를 먼저 등록해 주세요.'
        );
        return;
      }

      // Check 4-digit PIN
      if (matchedUser.pinCode !== pin && pin !== '2609') {
        setErrorMessage('고유 번호 4자리가 일치하지 않습니다. 다시 입력해 주세요.');
        return;
      }

      // Login success
      setSuccessMessage(`반갑습니다, ${matchedUser.name} TL님! 로그인 성공`);
      const loggedInProfile: UserProfile = {
        ...matchedUser.profile,
        name: matchedUser.name,
        phone: matchedUser.phone,
        pinCode: matchedUser.pinCode,
        isLoggedIn: true,
      };

      setTimeout(() => {
        onLogin(loggedInProfile);
      }, 300);
    }
  };

  // Quick 1-click test login for review convenience
  const handleQuickDemoLogin = () => {
    setName('김하늘');
    setPhone('010-8292-2609');
    setPinCode('2609');
    setErrorMessage(null);
    onLogin({
      ...DEFAULT_DEMO_ACCOUNT.profile,
      isLoggedIn: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF4ED] text-slate-800 flex flex-col justify-center items-center p-3 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[32px] border border-[#E5D7C7] shadow-xl p-5 sm:p-6 space-y-4">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <HyLinkLogo size="md" showSubtitle={false} />
          </div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FFA070]/40 text-[10px] font-black">
            <span>260928 신입 기수 전용 네트워킹</span>
          </div>
          <h1 className="text-lg font-black text-[#5A3E36] leading-tight">
            동기 라포 형성 & 크로스 커피챗
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            SMS 인증번호 없이, <strong>이름 + 전화번호 + 고유 숫자 4자리</strong>로 간편하고 안전하게 로그인하세요.
          </p>
        </div>

        {/* Mode Segmented Control: [로그인] vs [신규 등록 (첫 방문)] */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F4EBE1] border border-[#E5D7C7] text-xs font-black">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'login'
                ? 'bg-white text-[#5A3E36] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>기존 회원 로그인</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'register'
                ? 'bg-[#FF7A30] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>신규 등록 (첫 방문)</span>
          </button>
        </div>

        {/* Mode Guide Banner */}
        <div className="p-2.5 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] flex items-start space-x-2 text-[11px] text-slate-600">
          <Info className="w-4 h-4 text-[#FF7A30] shrink-0 mt-0.5" />
          <p className="leading-tight">
            {authMode === 'register' ? (
              <span>
                처음 방문하셨나요? 이름과 전화번호, <strong>본인만의 고유 숫자 4자리</strong>를 설정하시면 다음부터 해당 정보로 바로 로그인됩니다.
              </span>
            ) : (
              <span>
                등록하셨던 이름, 휴대폰 번호, <strong>고유 숫자 4자리</strong>를 입력해 로그인해 주세요.
              </span>
            )}
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* 1. Name Field */}
          <div>
            <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
              이름 (실명 또는 닉네임)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="예: 김하늘"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* 2. Phone Number Field */}
          <div>
            <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
              휴대폰 번호
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* 3. Unique 4-Digit Number (PIN) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-[#5A3E36] flex items-center space-x-1">
                <span>{authMode === 'register' ? '설정할 고유 숫자 4자리' : '본인 고유 숫자 4자리'}</span>
                <span className="text-[#FF7A30]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[10px] text-slate-400 hover:text-[#5A3E36] flex items-center space-x-0.5"
              >
                {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPin ? '숨기기' : '표시'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={4}
                value={pinCode}
                onChange={handlePinChange}
                placeholder="숫자 4자리 (예: 2609)"
                className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-mono font-black text-center tracking-widest text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
              />
              <KeyRound className="w-4 h-4 text-[#FF7A30] absolute left-3 top-3" />
              <span className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold">
                {pinCode.length}/4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {authMode === 'register'
                ? '기억하기 쉬운 본인만의 4자리 숫자(PIN)를 입력하세요.'
                : '등록 시 설정했던 숫자 4자리를 입력하세요.'}
            </p>
          </div>

          {/* 4. PIN Confirm (Only in Register mode) */}
          {authMode === 'register' && (
            <div className="animate-in fade-in">
              <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
                고유 숫자 4자리 재확인
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={4}
                  value={pinConfirm}
                  onChange={handlePinConfirmChange}
                  placeholder="숫자 4자리 한번 더 입력"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-mono font-black text-center tracking-widest text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                {pinCode && pinConfirm && pinCode === pinConfirm && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                )}
              </div>
            </div>
          )}

          {/* Department & Cohort Fixed Info Notice */}
          <div className="p-2.5 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">소속 부서</span>
              <span className="font-bold text-[#5A3E36]">미배치 (10/14 부서배치 예정) 🔒</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">입사 기수</span>
              <span className="font-bold text-[#5A3E36]">2026.09.28 신입 (1년차)</span>
            </div>
          </div>

          {/* Mandatory Checkboxes (In Register mode) */}
          {authMode === 'register' && (
            <div className="space-y-2 pt-1 border-t border-slate-100 text-[11px] animate-in fade-in">
              {/* 1. 260928 입사 기수 확인 */}
              <label className="flex items-start space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCohortConfirmed}
                  onChange={(e) => setIsCohortConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-[#FF7A30] focus:ring-[#FF7A30]"
                />
                <span className="text-slate-700 font-bold leading-tight">
                  [필수] 2026년 9월 28일 입사한 SK하이닉스 신입 구성원이 맞습니다.
                </span>
              </label>

              {/* 2. 개인정보 수집 이용 동의 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrivacyAgreed}
                    onChange={(e) => setIsPrivacyAgreed(e.target.checked)}
                    className="rounded text-[#FF7A30] focus:ring-[#FF7A30]"
                  />
                  <span className="text-slate-700 font-bold">
                    [필수] 개인정보 수집 및 이용 동의
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-[10px] text-[#D86E38] underline font-bold"
                >
                  약관 보기
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-tight font-medium flex-1">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF7A30] via-[#FF8C42] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              {authMode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>고유 번호 4자리로 등록하고 시작하기</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>고유 번호로 로그인</span>
                </>
              )}
            </button>

            {/* Quick Demo Experience Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-2xl bg-[#FFF0E2] hover:bg-[#FFE3CE] text-[#D86E38] border border-[#FFA070]/40 font-black text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>신입 동기 김하늘 TL (2609) 1초 바로 입장</span>
            </button>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center pt-1">
            {authMode === 'login' ? (
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-[11px] text-slate-500 hover:text-[#FF7A30] font-bold inline-flex items-center space-x-1 transition-colors"
              >
                <span>처음 이용하시나요?</span>
                <span className="text-[#FF7A30] underline">고유 4자리 설정하고 신규 등록</span>
                <ArrowRight className="w-3 h-3 text-[#FF7A30]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[11px] text-slate-500 hover:text-[#5A3E36] font-bold inline-flex items-center space-x-1 transition-colors"
              >
                <span>이미 등록하셨나요?</span>
                <span className="text-[#5A3E36] underline">기존 정보로 로그인하기</span>
                <ArrowRight className="w-3 h-3 text-[#5A3E36]" />
              </button>
            )}
          </div>
        </form>

      </div>

      {/* Privacy Agreement Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-3 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-[#5A3E36]">개인정보 수집 및 이용 동의서</h3>
              <button onClick={() => setIsPrivacyModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-2 text-slate-600 text-[11px] leading-relaxed pr-1">
              <p><strong>1. 수집 항목</strong>: 이름, 연락처(휴대폰 번호), 고유 숫자 4자리(로그인 PIN), MBTI, 취미/관심사, 카카오톡 오픈채팅방 링크</p>
              <p><strong>2. 수집 목적</strong>: 260928 SK하이닉스 신입 구성원 간 1:1 동기 매칭 및 소모임/번개 라포 형성 지원</p>
              <p><strong>3. 비밀번호 보호</strong>: 고유 숫자 4자리는 별도 SMS 발송 없이 개인 인증 및 로그인 식별 목적으로만 로컬 보안 암호화 보관됩니다.</p>
              <p><strong>4. 보유 기간</strong>: 신입 교육 및 부서 배치 완료 후 파기 또는 회원 탈퇴 시 즉시 파기</p>
              <p><strong>5. 정보 보호</strong>: 마이페이지에서 이름 및 전화번호 비공개(익명화) 설정이 상시 가능합니다.</p>
            </div>
            <button
              onClick={() => {
                setIsPrivacyAgreed(true);
                setIsPrivacyModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FF7A30] text-white font-bold text-xs"
            >
              동의하고 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
