import React, { useState } from 'react';
import { ROADMAP_STEPS } from '../data/roadmapData';
import { Step1Playground } from './Step1Playground';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Layers, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  Flame,
  FileCode2,
  Workflow,
  Play
} from 'lucide-react';

interface RoadmapTabProps {
  onGoToSimulator: () => void;
  onApplyProfileToMatching: (profile: any) => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({ onGoToSimulator, onApplyProfileToMatching }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0); // 1st step by default as requested!
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showLiveDemo, setShowLiveDemo] = useState(true);

  const currentStep = ROADMAP_STEPS[selectedStepIndex];

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getFullPromptText = () => {
    return `### [시스템 프롬프트 (System Prompt)]\n${currentStep.promptData.systemPrompt}\n\n### [입력 템플릿 (User Prompt Template)]\n${currentStep.promptData.userInputTemplate}\n\n### [예상 출력 스키마 (Output JSON)]\n${currentStep.promptData.outputSchemaExample}`;
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5" />
            <span>엔지니어링 마스터 플랜 & 프롬프트 패키지</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI 기반 동료 매칭 Agent 구축 로드맵 & 단계별 프롬프트 가이드
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            SKMS의 핵심 가치인 <strong className="text-white font-semibold">One Team</strong>과 <strong className="text-white font-semibold">자발적·의욕적 두뇌활용</strong>을 구현하기 위해 필요한 6단계 개발 과정과, 각 단계를 즉시 실행할 수 있는 프로덕션급 프롬프트 모음입니다.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onGoToSimulator}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-md shadow-rose-900/50"
            >
              <Sparkles className="w-4 h-4" />
              <span>실제 매칭 엔진 동작 테스트하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-4 text-xs text-slate-300 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>총 6개 개발 단계</span>
              </span>
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-rose-400" />
                <span>Gemini 3.8 Flash 최적화</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Process Step Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {ROADMAP_STEPS.map((step, idx) => {
          const isSelected = selectedStepIndex === idx;
          return (
            <button
              key={step.stepNumber}
              onClick={() => setSelectedStepIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Step {step.stepNumber}
                </span>
                <span className="text-[11px] text-slate-400">{step.duration}</span>
              </div>
              <p
                className={`text-xs font-bold line-clamp-1 ${
                  isSelected ? 'text-rose-900' : 'text-slate-800'
                }`}
              >
                {step.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Step 1 Live Demo Showcase */}
      {selectedStepIndex === 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  1단계 AI 프롬프트 실현: 3~4단계 객관식 설문 & 한줄 서술형 자기소개 결합
                </span>
                <span className="text-[11px] text-slate-500">
                  긴 줄글 작성의 피로도를 없애고, 30초 객관식 설문(만남 목적/스타일/취미) + 한줄 서술을 Gemini AI가 표준 매칭 프로필로 실시간 합성합니다.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLiveDemo(!showLiveDemo)}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-all flex items-center space-x-1.5 self-start sm:self-center shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showLiveDemo ? '라이브 데모 접기' : '라이브 데모 열기'}</span>
            </button>
          </div>

          {showLiveDemo && (
            <Step1Playground onApplyProfileToMatching={onApplyProfileToMatching} />
          )}
        </div>
      )}

      {/* Main Step Detail Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stage Overview & Architecture (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-rose-600 tracking-wider uppercase">
                  {currentStep.phase}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {currentStep.title}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                0{currentStep.stepNumber}
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>핵심 달성 목표</span>
              </h3>
              <p className="text-sm font-medium text-slate-800 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                {currentStep.koreanGoal}
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>시스템 구현 개요</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentStep.architectureOverview}
              </p>
            </div>

            {/* Deliverables */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>필수 산출물 (Deliverables)</span>
              </h3>
              <ul className="space-y-1.5">
                {currentStep.deliverables.map((item, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                    <span className="text-rose-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Model */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-700">권장 LLM</span>
              </div>
              <span className="font-mono font-bold text-rose-600">
                {currentStep.recommendedModel}
              </span>
            </div>
          </div>

          {/* Practical Tips Card */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>실전 배포 시 유의사항 & 팁</span>
            </div>
            <ul className="space-y-2">
              {currentStep.promptData.tips.map((tip, i) => (
                <li key={i} className="text-xs text-amber-950/80 flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Production Prompt Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header with copy actions */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <FileCode2 className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-sm sm:text-base">
                    {currentStep.promptData.promptTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gemini API나 사내 프롬프트 템플릿에 그대로 주입할 수 있는 검증된 프롬프트입니다.
                </p>
              </div>

              <button
                onClick={() => handleCopy(getFullPromptText(), 'full')}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all self-start sm:self-center shadow-xs"
              >
                {copiedSection === 'full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>전체 복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>프롬프트 전체 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Section 1: System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. 시스템 지시문 (System Instruction)
                  </span>
                  <button
                    onClick={() => handleCopy(currentStep.promptData.systemPrompt, 'sys')}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
                  >
                    {copiedSection === 'sys' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSection === 'sys' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {currentStep.promptData.systemPrompt}
                </pre>
              </div>

              {/* Section 2: User Input Template */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. 사용자 입력 및 파라미터 템플릿 (User Prompt Template)
                  </span>
                  <button
                    onClick={() => handleCopy(currentStep.promptData.userInputTemplate, 'input')}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
                  >
                    {copiedSection === 'input' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSection === 'input' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {currentStep.promptData.userInputTemplate}
                </pre>
              </div>

              {/* Section 3: Expected Output Schema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. 기대 출력 JSON 스키마 및 예시 (Output Schema)
                  </span>
                  <button
                    onClick={() => handleCopy(currentStep.promptData.outputSchemaExample, 'output')}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
                  >
                    {copiedSection === 'output' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSection === 'output' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
                  {currentStep.promptData.outputSchemaExample}
                </pre>
              </div>

              {/* Action Banner to simulator */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  위 프롬프트가 실제로 브라우저 상에서 동작하는 과정을 확인해 보세요.
                </p>
                <button
                  onClick={onGoToSimulator}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  <span>매칭 시뮬레이터로 이동</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
