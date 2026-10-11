import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  MousePointer, 
  Coffee,
  Flame,
  ShieldCheck,
  Zap,
  FastForward
} from 'lucide-react';
import { AppTab } from './Navbar';
import { UserProfile } from '../types';

interface LiveInteractiveDemoControllerProps {
  isActive: boolean;
  onClose: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isMyPageOpen: boolean;
  setIsMyPageOpen: (open: boolean) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

interface StepNarrative {
  stage: number;
  title: string;
  subtitle: string;
}

export const LiveInteractiveDemoController: React.FC<LiveInteractiveDemoControllerProps> = ({
  isActive,
  onClose,
  activeTab,
  setActiveTab,
  isMyPageOpen,
  setIsMyPageOpen,
  currentUser,
  setCurrentUser,
}) => {
  // Cursor coordinate state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 200, y: 300 });
  const [isClicking, setIsClicking] = useState(false);
  const [clickPings, setClickPings] = useState<{ id: number; x: number; y: number }[]>([]);
  
  // Playback control
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1); // 1x or 1.5x
  const [currentStage, setCurrentStage] = useState<number>(1); // 1: Profile, 2: Gatherings/Pool, 3: Survey & Matching
  const [subStep, setSubStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState('시연을 시작합니다...');

  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Stages definition
  const STAGES: StepNarrative[] = [
    {
      stage: 1,
      title: '1단계: 마이페이지 & 프로필 설정',
      subtitle: '아바타 선택, 260928 입사 정보 확인, 비공개 토글 및 취미 해시태그 입력',
    },
    {
      stage: 2,
      title: '2단계: 동기 소모임 & 네트워킹 탐색',
      subtitle: '소모임/번개 탭으로 이동하여 260928 동기들이 개설한 모임과 활동을 둘러봅니다.',
    },
    {
      stage: 3,
      title: '3단계: 1:1 맞춤 매칭 신청서 작성',
      subtitle: '취미/운동 메이트, 또래 동기, 러닝·테니스·배드민턴 선택 후 최종 1:1 매칭 신청!',
    },
  ];

  // Helper: Smoothly move cursor to target element
  const moveCursorTo = useCallback((targetX: number, targetY: number, duration: number = 700): Promise<void> => {
    return new Promise((resolve) => {
      const startX = cursorPos.x;
      const startY = cursorPos.y;
      const startTime = performance.now();
      const scaledDuration = duration / speedRef.current;

      const animate = (currentTime: number) => {
        if (!isPlayingRef.current) {
          // If paused, wait and retry
          animFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / scaledDuration);
        
        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        const curX = startX + (targetX - startX) * ease;
        const curY = startY + (targetY - startY) * ease;
        
        setCursorPos({ x: curX, y: curY });

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCursorPos({ x: targetX, y: targetY });
          resolve();
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    });
  }, [cursorPos]);

  // Helper: Trigger click animation and dispatch real click
  const triggerClick = useCallback((element?: HTMLElement | null, delayAfter: number = 400): Promise<void> => {
    return new Promise((resolve) => {
      setIsClicking(true);
      const pingId = Date.now();
      setClickPings((prev) => [...prev, { id: pingId, x: cursorPos.x, y: cursorPos.y }]);

      setTimeout(() => {
        setIsClicking(false);
        setClickPings((prev) => prev.filter((p) => p.id !== pingId));
      }, 500);

      if (element) {
        // Dispatch real click
        element.click();
      }

      const scaledDelay = delayAfter / speedRef.current;
      setTimeout(() => {
        resolve();
      }, scaledDelay);
    });
  }, [cursorPos]);

  // Helper: Wait utility respecting playback state
  const wait = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      const scaled = ms / speedRef.current;
      setTimeout(resolve, scaled);
    });
  }, []);

  // Main Orchestrator Loop based on currentStage and subStep
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    let isCancelled = false;

    const runScript = async () => {
      // ----------------------------------------------------
      // STAGE 1: MyPage & Profile Setup
      // ----------------------------------------------------
      if (currentStage === 1) {
        if (subStep === 0) {
          setStatusMessage('상단 [마이] 버튼으로 이동하여 프로필 설정을 엽니다.');
          await wait(500);
          if (isCancelled) return;

          // Find [마이] button
          const myBtn = document.querySelector('button[title*="마이페이지"]') as HTMLElement || 
                        Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('마이'));
          
          if (myBtn) {
            const rect = myBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 800);
            if (isCancelled) return;
            await triggerClick(myBtn, 500);
            setIsMyPageOpen(true);
          } else {
            setIsMyPageOpen(true);
          }
          if (isCancelled) return;
          setSubStep(1);
        } else if (subStep === 1) {
          setStatusMessage('프로필 아바타(하루 마스코트)를 선택합니다.');
          await wait(600);
          if (isCancelled) return;

          // Find avatar preset buttons in MyPageModal
          const avatarBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('하루') && !b.textContent?.includes('악마')
          );
          if (avatarBtn) {
            const rect = avatarBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 700);
            if (isCancelled) return;
            await triggerClick(avatarBtn, 400);
          }
          if (isCancelled) return;
          setSubStep(2);
        } else if (subStep === 2) {
          setStatusMessage('기본 정보(이름, 소속부서, 1년차 고정)를 확인하고 스크롤합니다.');
          await wait(400);
          if (isCancelled) return;

          // Smooth scroll inside modal
          const modalForm = document.querySelector('form.space-y-4') || document.querySelector('.overflow-y-auto');
          if (modalForm) {
            modalForm.scrollBy({ top: 180, behavior: 'smooth' });
          }
          await wait(700);
          if (isCancelled) return;

          // Focus Name input
          const nameInput = document.querySelector('input[placeholder*="이름"]') as HTMLInputElement ||
                            Array.from(document.querySelectorAll('input')).find((inp) => inp.value?.includes('김'));
          if (nameInput) {
            const rect = nameInput.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(nameInput, 300);
            nameInput.focus();
          }
          if (isCancelled) return;
          setSubStep(3);
        } else if (subStep === 3) {
          setStatusMessage('정보 공개/비공개 설정을 확인하고 MBTI(ENFP)를 선택합니다.');
          await wait(500);
          if (isCancelled) return;

          const modalForm = document.querySelector('form.space-y-4') || document.querySelector('.overflow-y-auto');
          if (modalForm) {
            modalForm.scrollBy({ top: 220, behavior: 'smooth' });
          }
          await wait(600);
          if (isCancelled) return;

          // Select MBTI ENFP
          const enfpBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'ENFP');
          if (enfpBtn) {
            const rect = enfpBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 700);
            if (isCancelled) return;
            await triggerClick(enfpBtn, 400);
          }
          if (isCancelled) return;
          setSubStep(4);
        } else if (subStep === 4) {
          setStatusMessage('취미 및 관심사 해시태그(#테니스, #커피마실사람)를 등록합니다.');
          await wait(400);
          if (isCancelled) return;

          // Click hashtag chips
          const tennisTag = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('#테니스'));
          if (tennisTag) {
            const rect = tennisTag.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(tennisTag, 300);
          }

          const coffeeTag = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('#커피마실사람'));
          if (coffeeTag) {
            const rect = coffeeTag.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(coffeeTag, 400);
          }
          if (isCancelled) return;
          setSubStep(5);
        } else if (subStep === 5) {
          setStatusMessage('하단으로 스크롤하여 [프로필 설정 완료 및 저장]을 누릅니다.');
          await wait(400);
          if (isCancelled) return;

          const modalForm = document.querySelector('form.space-y-4') || document.querySelector('.overflow-y-auto');
          if (modalForm) {
            modalForm.scrollBy({ top: 300, behavior: 'smooth' });
          }
          await wait(600);
          if (isCancelled) return;

          const saveBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('저장') || b.textContent?.includes('완료')
          );
          if (saveBtn) {
            const rect = saveBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 700);
            if (isCancelled) return;
            await triggerClick(saveBtn, 600);
          } else {
            setIsMyPageOpen(false);
          }

          setStatusMessage('✅ 1단계 프로필 작성이 완료되었습니다! 다음 단계로 이동합니다.');
          await wait(900);
          if (isCancelled) return;

          setIsMyPageOpen(false);
          setCurrentStage(2);
          setSubStep(0);
        }
      }

      // ----------------------------------------------------
      // STAGE 2: Colleague Pool & Gathering Exploration
      // ----------------------------------------------------
      else if (currentStage === 2) {
        if (subStep === 0) {
          setStatusMessage('하단 탭 바에서 [소모임/번개] 탭으로 이동합니다.');
          await wait(500);
          if (isCancelled) return;

          const gatheringTabBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('소모임') || b.textContent?.includes('번개')
          );
          if (gatheringTabBtn) {
            const rect = gatheringTabBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 750);
            if (isCancelled) return;
            await triggerClick(gatheringTabBtn, 500);
          }
          setActiveTab('gatherings');
          if (isCancelled) return;
          setSubStep(1);
        } else if (subStep === 1) {
          setStatusMessage('260928 동기들이 개설한 소모임 목록을 스크롤하며 둘러봅니다.');
          await wait(600);
          if (isCancelled) return;

          const mainViewport = document.querySelector('main.overflow-y-auto') || window;
          if (mainViewport instanceof HTMLElement) {
            mainViewport.scrollBy({ top: 220, behavior: 'smooth' });
          }
          await wait(800);
          if (isCancelled) return;

          // Hover / Move to a gathering card (e.g. Tennis & Badminton)
          const sportsCard = Array.from(document.querySelectorAll('h3, div')).find(
            (el) => el.textContent?.includes('테니스') || el.textContent?.includes('배드민턴')
          );
          if (sportsCard) {
            const rect = sportsCard.getBoundingClientRect();
            await moveCursorTo(rect.left + 80, rect.top + 20, 700);
          }
          await wait(700);
          if (isCancelled) return;
          setSubStep(2);
        } else if (subStep === 2) {
          setStatusMessage('오픈채팅 참여 및 모임 상세 조건을 확인합니다.');
          await wait(600);
          if (isCancelled) return;

          const mainViewport = document.querySelector('main.overflow-y-auto') || window;
          if (mainViewport instanceof HTMLElement) {
            mainViewport.scrollBy({ top: 200, behavior: 'smooth' });
          }
          await wait(800);
          if (isCancelled) return;

          setStatusMessage('✅ 2단계 동기풀 탐색 완료! 1:1 맞춤 매칭 신청으로 이동합니다.');
          await wait(900);
          if (isCancelled) return;

          setCurrentStage(3);
          setSubStep(0);
        }
      }

      // ----------------------------------------------------
      // STAGE 3: Survey Wizard & Matching Application
      // ----------------------------------------------------
      else if (currentStage === 3) {
        if (subStep === 0) {
          setStatusMessage('하단 탭 바에서 [1:1 매칭신청] 탭을 클릭합니다.');
          await wait(500);
          if (isCancelled) return;

          const surveyTabBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('1:1 매칭') || b.textContent?.includes('매칭신청')
          );
          if (surveyTabBtn) {
            const rect = surveyTabBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 750);
            if (isCancelled) return;
            await triggerClick(surveyTabBtn, 500);
          }
          setActiveTab('survey');
          if (isCancelled) return;
          setSubStep(1);
        } else if (subStep === 1) {
          setStatusMessage('1단계 (만남 목적): [취미 / 운동 메이트]를 선택합니다.');
          await wait(600);
          if (isCancelled) return;

          const hobbyCard = Array.from(document.querySelectorAll('div, button')).find(
            (el) => el.textContent?.includes('취미 / 운동 메이트') || el.textContent?.includes('취미/운동')
          );
          if (hobbyCard) {
            const rect = hobbyCard.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 700);
            if (isCancelled) return;
            await triggerClick(hobbyCard as HTMLElement, 400);
          }

          // Click Next Step
          const nextBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('다음') || b.textContent?.includes('다음 단계')
          );
          if (nextBtn) {
            const rect = nextBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(nextBtn, 500);
          }
          if (isCancelled) return;
          setSubStep(2);
        } else if (subStep === 2) {
          setStatusMessage('2단계 (선호 동료): [나이가 비슷한 또래 동기]를 선택합니다.');
          await wait(600);
          if (isCancelled) return;

          const peerCard = Array.from(document.querySelectorAll('div, button')).find(
            (el) => el.textContent?.includes('또래 동료') || el.textContent?.includes('또래 동기')
          );
          if (peerCard) {
            const rect = peerCard.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 700);
            if (isCancelled) return;
            await triggerClick(peerCard as HTMLElement, 400);
          }

          // Click Next Step
          const nextBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('다음') || b.textContent?.includes('다음 단계')
          );
          if (nextBtn) {
            const rect = nextBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(nextBtn, 500);
          }
          if (isCancelled) return;
          setSubStep(3);
        } else if (subStep === 3) {
          setStatusMessage('3단계 (관심사 & 세부 취미): #러닝, #테니스, #배드민턴을 복수 선택합니다.');
          await wait(600);
          if (isCancelled) return;

          // Click 운동/스포츠 tab if needed
          const sportsTab = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('운동') || b.textContent?.includes('스포츠')
          );
          if (sportsTab) {
            const rect = sportsTab.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 500);
            if (isCancelled) return;
            await triggerClick(sportsTab, 300);
          }

          // Click chips: 러닝, 테니스, 배드민턴
          const tagsToClick = ['러닝', '테니스', '배드민턴'];
          for (const tagName of tagsToClick) {
            const tagBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes(tagName));
            if (tagBtn) {
              const rect = tagBtn.getBoundingClientRect();
              await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 550);
              if (isCancelled) return;
              await triggerClick(tagBtn, 300);
            }
          }

          // Click Next Step
          const nextBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('다음') || b.textContent?.includes('다음 단계')
          );
          if (nextBtn) {
            const rect = nextBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(nextBtn, 500);
          }
          if (isCancelled) return;
          setSubStep(4);
        } else if (subStep === 4) {
          setStatusMessage('4단계: [1:1 단독 만남] 및 [주말 사외 활동]을 선택합니다.');
          await wait(600);
          if (isCancelled) return;

          // Select 1:1
          const oneOnOne = Array.from(document.querySelectorAll('div, button')).find(
            (el) => el.textContent?.includes('1:1 단독 만남') || el.textContent?.includes('1:1')
          );
          if (oneOnOne) {
            const rect = oneOnOne.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 600);
            if (isCancelled) return;
            await triggerClick(oneOnOne as HTMLElement, 350);
          }

          // Scroll down to meeting format
          const mainViewport = document.querySelector('main.overflow-y-auto') || window;
          if (mainViewport instanceof HTMLElement) {
            mainViewport.scrollBy({ top: 220, behavior: 'smooth' });
          }
          await wait(600);
          if (isCancelled) return;

          // Select 주말 사외 취미
          const weekendOption = Array.from(document.querySelectorAll('button, div')).find(
            (el) => el.textContent?.includes('주말') && el.textContent?.includes('활동')
          );
          if (weekendOption) {
            const rect = weekendOption.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 650);
            if (isCancelled) return;
            await triggerClick(weekendOption as HTMLElement, 400);
          }
          if (isCancelled) return;
          setSubStep(5);
        } else if (subStep === 5) {
          setStatusMessage('하단으로 스크롤하여 [✨ 1:1 맞춤 매칭 신청하기]를 최종 클릭합니다.');
          await wait(500);
          if (isCancelled) return;

          const mainViewport = document.querySelector('main.overflow-y-auto') || window;
          if (mainViewport instanceof HTMLElement) {
            mainViewport.scrollBy({ top: 300, behavior: 'smooth' });
          }
          await wait(700);
          if (isCancelled) return;

          const submitBtn = Array.from(document.querySelectorAll('button')).find(
            (b) => b.textContent?.includes('신청하기') || b.textContent?.includes('매칭 신청')
          );
          if (submitBtn) {
            const rect = submitBtn.getBoundingClientRect();
            await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 800);
            if (isCancelled) return;
            await triggerClick(submitBtn, 800);
          }

          setStatusMessage('🎉 모든 조건 선택 및 1:1 맞춤 매칭 신청이 정상 접수되었습니다!');
          await wait(1200);
          if (isCancelled) return;
          setSubStep(6);
        }
      }
    };

    runScript();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, isPlaying, currentStage, subStep, speed, moveCursorTo, triggerClick, wait, setActiveTab, setIsMyPageOpen]);

  if (!isActive) return null;

  const currentNarrative = STAGES.find((s) => s.stage === currentStage) || STAGES[0];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none font-sans">
      {/* 1. Real Virtual Human Mouse Cursor Layer */}
      <div 
        className="fixed z-[9999] pointer-events-none transition-transform will-change-transform"
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Cursor SVG */}
        <div className={`relative -top-1 -left-1 ${isClicking ? 'scale-90' : 'scale-100'} transition-transform duration-100`}>
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {/* Outer Stroke */}
            <path 
              d="M3 3l7 18 3-7 7-3L3 3z" 
              fill="#FF7A30" 
              stroke="#FFFFFF" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />
          </svg>

          {/* User Cursor Tag Badge */}
          <div className="absolute left-5 top-5 bg-[#5A3E36] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap border border-white/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA070] animate-ping" />
            <span>신입 TL 조작 중</span>
          </div>
        </div>
      </div>

      {/* 2. Click Pings & Ripples at Exact Coordinates */}
      {clickPings.map((ping) => (
        <div
          key={ping.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: `${ping.x}px`,
            top: `${ping.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="block w-8 h-8 rounded-full border-2 border-[#FF7A30] bg-[#FF7A30]/30 animate-ping" />
        </div>
      ))}

      {/* 3. Floating Interactive Controller HUD (Top Docked Banner) */}
      <aside aria-label="화면 조작 시연 컨트롤러" className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md pointer-events-auto z-[9990] animate-in slide-in-from-top-4 duration-300">
        <div className="bg-[#4D352D]/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-white/15 p-3.5 space-y-2.5">
          {/* Top Bar: Stage & Action Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FF7A30] text-white text-[10px] font-black flex items-center space-x-1">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>실제 화면 조작 시연</span>
              </span>
              <span className="text-xs font-bold text-white/90">
                {currentStage} / 3단계
              </span>
            </div>

            {/* Playback Button Group */}
            <div className="flex items-center space-x-1.5">
              {/* Speed Toggle */}
              <button
                onClick={() => setSpeed((s) => (s === 1 ? 1.5 : 1))}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white/90 transition-colors"
                title="재생 속도"
              >
                {speed}x
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>

              {/* Replay */}
              <button
                onClick={() => {
                  setCurrentStage(1);
                  setSubStep(0);
                  setIsPlaying(true);
                }}
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="처음부터 다시"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close / Exit */}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors ml-1"
                title="시연 종료 (직접 사용하기)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Step Title & Subtitle */}
          <div>
            <h4 className="text-xs font-black text-white flex items-center space-x-1.5">
              <span>{currentNarrative.title}</span>
            </h4>
            <p className="text-[11px] text-[#FFA070] font-medium mt-0.5 leading-snug">
              👉 {statusMessage}
            </p>
          </div>

          {/* Progress Bar & Stage Buttons */}
          <div className="flex items-center space-x-1.5 pt-0.5">
            {[1, 2, 3].map((stg) => (
              <button
                key={stg}
                onClick={() => {
                  setCurrentStage(stg);
                  setSubStep(0);
                  setIsPlaying(true);
                }}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  currentStage === stg 
                    ? 'bg-[#FF7A30] shadow-sm' 
                    : currentStage > stg 
                    ? 'bg-emerald-400' 
                    : 'bg-white/20'
                }`}
                title={`${stg}단계로 건너뛰기`}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
