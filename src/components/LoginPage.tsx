import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  User, 
  Smartphone, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  FileText, 
  X,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { HyLinkLogo } from './HyLinkLogo';
import { MASCOT_AVATARS } from '../data/mockGatherings';

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('김하늘');
  const [phone, setPhone] = useState('010-8292-2609');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isCohortConfirmed, setIsCohortConfirmed] = useState(true); // 260928 입사 확인
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(true); // 개인정보 수집 이용 동의
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Send SMS verification code simulation
  const handleSendCode = () => {
    if (!phone || phone.length < 10) return;
    setIsCodeSent(true);
    setVerificationCode('260928'); // Pre-fill mock SMS code for ease of test!
  };

  const handleVerifyCode = () => {
    if (verificationCode === '260928' || verificationCode.length >= 4) {
      setIsPhoneVerified(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isCohortConfirmed || !isPrivacyAgreed) {
      alert('260928 입사 기수 확인 및 개인정보 이용동의가 필요합니다.');
      return;
    }

    const defaultProfile: UserProfile = {
      name: name.trim() || '김하늘',
      phone: phone.trim() || '010-8292-2609',
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
    };

    onLogin(defaultProfile);
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
            6명 조원 외에도 300명 동기들과 친해질 기회!<br/>
            10/14 부서배치 전, 나와 성향이 잘 맞는 친구를 찾아보세요.
          </p>
        </div>

        {/* 260928 Freshmen Verification Box */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
              이름 (실명 또는 닉네임)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김하늘"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-medium">
                비공개 설정 가능
              </span>
            </div>
          </div>

          {/* Phone Number Field with SMS Verification */}
          <div>
            <label className="block text-[11px] font-black text-[#5A3E36] mb-1">
              휴대폰 번호 (본인 인증용)
            </label>
            <div className="flex space-x-2">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#E5D7C7] bg-[#FAF4ED] font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="px-3 py-2 rounded-xl bg-[#5A3E36] text-white font-bold text-xs hover:bg-[#48312B] transition-colors shrink-0"
              >
                {isCodeSent ? '재전송' : '인증요청'}
              </button>
            </div>
          </div>

          {/* SMS Code Input */}
          {isCodeSent && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-900">SMS 인증번호 6자리</span>
                <span className="text-[10px] text-emerald-600 font-bold">인증코드: 260928</span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="260928"
                  className="flex-1 px-3 py-2 rounded-lg border border-amber-300 bg-white font-mono font-black text-center text-sm"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700"
                >
                  {isPhoneVerified ? '✓ 인증됨' : '확인'}
                </button>
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
              <span className="text-slate-400">입사 일자</span>
              <span className="font-bold text-[#5A3E36]">2026.09.28 신입 (1년차)</span>
            </div>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-2 pt-1 border-t border-slate-100 text-[11px]">
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

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Kakao Style Easy Start Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-slate-900" />
              <span>카카오 계정으로 간편 가입 & 시작</span>
            </button>

            {/* Quick Experience Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#FFA070] text-white font-black text-xs shadow-md shadow-[#FFA070]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>신입 동기(김하늘 TL)로 바로 입장하기</span>
            </button>
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
              <p><strong>1. 수집 항목</strong>: 이름, 연락처(휴대폰 번호), 출생년도, MBTI, 취미/관심사, 카카오톡 오픈채팅방 링크</p>
              <p><strong>2. 수집 목적</strong>: 260928 SK하이닉스 신입 구성원 간 1:1 동기 매칭 및 소모임/번개 라포 형성 지원</p>
              <p><strong>3. 보유 기간</strong>: 신입 교육 및 부서 배치 완료 후 파기 또는 회원 탈퇴 시 즉시 파기</p>
              <p><strong>4. 보안 보호</strong>: 회원의 모든 정보는 마이페이지에서 개별 항목별로 비공개(익명화) 설정이 가능하며, 관리자는 문제 발생 시에만 제한적으로 열람합니다.</p>
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
