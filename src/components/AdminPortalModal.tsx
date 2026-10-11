import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Flame,
  FileText
} from 'lucide-react';
import { useAppTheme } from '../theme/ThemeContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredCount?: number;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ 
  isOpen, 
  onClose,
  registeredCount = 42 
}) => {
  const { theme } = useAppTheme();

  // Feature Toggles Controlled by Admin
  const [isMatchingOpen, setIsMatchingOpen] = useState(false); // 50명 모이면 활성화
  const [isGatheringAllowed, setIsGatheringAllowed] = useState(true); // 소모임 개설 허용
  const [isDeptSyncReady, setIsDeptSyncReady] = useState(false); // 10/14 부서배치 연동

  // Emergency Audit Access (문제 발생 시에만 제한적 열람)
  const [isEmergencyUnlocked, setIsEmergencyUnlocked] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  if (!isOpen) return null;

  const mockCohortMembers = [
    { id: '1', name: '김*늘', phone: '010-****-2609', mbti: 'ENFP', tags: '#테니스, #러닝', reportCount: 0 },
    { id: '2', name: '이*현', phone: '010-****-1102', mbti: 'ESTP', tags: '#러닝, #클라이밍', reportCount: 0 },
    { id: '3', name: '오*윤', phone: '010-****-3391', mbti: 'ENTP', tags: '#보드게임, #커피', reportCount: 0 },
    { id: '4', name: '최*민', phone: '010-****-8842', mbti: 'ISFJ', tags: '#맛집, #기숙사', reportCount: 0 },
    { id: '5', name: '박*영', phone: '010-****-7719', mbti: 'ENTP', tags: '#테니스, #배드민턴', reportCount: 0 },
  ];

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockReason.trim()) return;
    setIsEmergencyUnlocked(true);
    setShowUnlockDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] bg-white rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-black">260928 신입 기수 관리자 제어 센터</h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-bold">
                  Admin Control
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                인원별 기능 온/오프 및 개인정보 보호 제한 접근 제어
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* 1. Feature Toggles Card (Based on cohort size) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>핵심 기능 활성화 제어 (인원 기준)</span>
              </span>
              <span className="text-[11px] font-extrabold text-[#D86E38] bg-[#FFF0E2] px-2 py-0.5 rounded-full">
                현재 {registeredCount}명 / 50명
              </span>
            </div>

            {/* Toggle 1: Matching Feature */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">1:1 맞춤 추천 매칭 오픈</span>
                <p className="text-[10px] text-slate-500">
                  {isMatchingOpen 
                    ? '현재 신입 동기들에게 1:1 추천 결과가 열려 있습니다.' 
                    : '50명 모집 달성 시 관리자 승인 하에 오픈됩니다 (현재 대기 상태).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMatchingOpen(!isMatchingOpen)}
                className={`p-1 rounded-full transition-colors ${
                  isMatchingOpen ? 'text-indigo-600' : 'text-slate-300'
                }`}
              >
                {isMatchingOpen ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            {/* Toggle 2: Gathering Allowed */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">소모임 / 번개 개설 및 참여</span>
                <p className="text-[10px] text-slate-500">
                  신입 동기들이 자유롭게 기숙사/운동/맛집 번개를 열 수 있도록 허용합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGatheringAllowed(!isGatheringAllowed)}
                className={`p-1 rounded-full transition-colors ${
                  isGatheringAllowed ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {isGatheringAllowed ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            {/* Toggle 3: Department Placement Sync */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">10/14 부서배치 연동 기능</span>
                <p className="text-[10px] text-slate-500">
                  부서 배치가 완료된 후 현업 부서명 자동 반영 기능을 활성화합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeptSyncReady(!isDeptSyncReady)}
                className={`p-1 rounded-full transition-colors ${
                  isDeptSyncReady ? 'text-indigo-600' : 'text-slate-300'
                }`}
              >
                {isDeptSyncReady ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
          </div>

          {/* 2. Privacy & Emergency Audit Access */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-amber-950 font-black">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>개인정보 보호 및 제한적 접근 정책</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isEmergencyUnlocked ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isEmergencyUnlocked ? '긴급 열람 모드 활성화됨' : '보호 모드 (마스킹 적용)'}
              </span>
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed">
              관리자라 할지라도 평상시에는 동기들의 개인정보(실명, 전화번호)를 열람할 수 없으며 마스킹 처리됩니다. 
              <strong>분쟁 또는 비매너 행위 신고 등 문제 발생 시에만 사유를 기록하고 제한적으로 열람</strong>할 수 있습니다.
            </p>

            {/* Unlock Button */}
            {!isEmergencyUnlocked ? (
              <button
                type="button"
                onClick={() => setShowUnlockDialog(true)}
                className="w-full py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>문제 발생 시 긴급 열람 잠금 해제</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[11px] flex items-center justify-between">
                <span>사유 기록됨: [{unlockReason}]</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsEmergencyUnlocked(false);
                    setUnlockReason('');
                  }}
                  className="font-bold underline text-red-700"
                >
                  보호 모드로 복귀
                </button>
              </div>
            )}
          </div>

          {/* 3. Member List (Masked by default) */}
          <div className="space-y-2">
            <span className="font-black text-xs text-slate-800 block">
              가입된 신입 동기 현황 ({mockCohortMembers.length}명 예시)
            </span>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">이름</th>
                    <th className="p-2.5">연락처</th>
                    <th className="p-2.5">MBTI</th>
                    <th className="p-2.5">키워드</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {mockCohortMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-900">
                        {isEmergencyUnlocked ? m.name.replace('*', '하') : m.name}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {isEmergencyUnlocked ? m.phone.replace('****', '1234') : m.phone}
                      </td>
                      <td className="p-2.5">{m.mbti}</td>
                      <td className="p-2.5 text-slate-500">{m.tags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>

      </div>

      {/* Emergency Unlock Reason Dialog */}
      {showUnlockDialog && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl border border-red-300">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-black text-sm">긴급 열람 사유 입력</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              사내 규정에 따라, 개인정보 열람 시 감사 기록에 사유가 영구 저장됩니다.
            </p>
            <textarea
              rows={2}
              required
              value={unlockReason}
              onChange={(e) => setUnlockReason(e.target.value)}
              placeholder="예: 10/11 번개 모임 관련 비매너 신고 접수 확인 건"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowUnlockDialog(false)}
                className="flex-1 py-2 rounded-xl border text-slate-600 text-xs font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleUnlockSubmit}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700"
              >
                사유 제출 및 열람
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
