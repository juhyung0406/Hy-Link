import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  HeartHandshake, 
  ShieldCheck, 
  Building2, 
  CheckCircle,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const DashboardTab: React.FC = () => {
  return (
    <div className="space-y-4 pb-28">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>성과 검증 및 SKMS One Team 문화 확산 지표</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            AI 동료 매칭 프로그램 핵심 성과(KPI) 대시보드
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            제안서 14번에 정의된 검증 기준과 학술 연구 근거를 바탕으로 조직 내 관계 형성과 지식 공유 성과를 모니터링합니다.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-rose-50 text-rose-800 px-3.5 py-2 rounded-xl border border-rose-200 font-semibold self-start md:self-center">
          <Award className="w-4 h-4 text-rose-600" />
          <span>One Team Index: 92.8점 (+18.4% 상승)</span>
        </div>
      </div>

      {/* 5 Core KPIs (Item 14 of User Brief) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">동료 탐색 소요 시간</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">3.4분</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>기존 4.2일 대비 98.7% 단축</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            사내 지인 수소문 없이 AI가 즉시 적합 동료 선별
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">AI 추천 만족도</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">4.85 / 5.0</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>참여자 94.2% 긍정 평가</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            공통 관심사 및 추천 이유의 설득력 만족
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">실제 만남 의향</span>
            <HeartHandshake className="w-4 h-4 text-rose-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">92.4%</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>추천 상대 호감도</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            추천받은 동료와 실제로 대화하고 싶다는 응답
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">매칭 수락률</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">86.4%</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>신청 대비 수락 비율</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Soft Decline 안내로 심리적 거부감 최소화
          </p>
        </div>

        {/* KPI 5 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">실제 만남 성사율</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">74.2%</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>총 256건 만남 완료</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            단순 매칭을 넘어 사내 카페/라운지 30분 티타임 성사
          </p>
        </div>
      </div>

      {/* Cross-Department Collaboration Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Department Cross Interaction Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                부서 간 지식 교류 & 크로스 매칭 현황
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                평소 교류가 적었던 이종 부서 간의 지식 공유와 협업 접점 형성
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
              One Team 연계
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              {
                pair: '반도체 공정개발 (R&D) ↔ AI 솔루션팀',
                desc: '현업 제조 공정 데이터와 AI 모델링 노하우 공유',
                count: '78건 매칭',
                percent: 92,
                color: 'bg-rose-500',
              },
              {
                pair: '신입 사원 ↔ 피플&컬처(HR) / 타부서 3~5년차 선배',
                desc: '사내 온보딩, 조직 적응 및 비공식 멘토링 형성',
                count: '64건 매칭',
                percent: 85,
                color: 'bg-amber-500',
              },
              {
                pair: '마케팅 / 사업개발 ↔ 선행 R&D 연구팀',
                desc: '글로벌 고객 니즈와 차세대 신기술 스펙 상호 이해',
                count: '51건 매칭',
                percent: 74,
                color: 'bg-indigo-500',
              },
              {
                pair: '스마트팩토리 (생산기술) ↔ 품질경영팀',
                desc: '현장 센서 모니터링 및 실시간 불량률 조기 감지 협력',
                count: '43건 매칭',
                percent: 68,
                color: 'bg-emerald-500',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.pair}</span>
                  <span className="font-semibold text-slate-600">{item.count}</span>
                </div>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative feedback snippet */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
            <span className="text-xs font-bold text-rose-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>실제 참여 신입 구성원 후기</span>
            </span>
            <p className="text-xs text-rose-950 leading-relaxed italic">
              "타 부서에 아는 사람이 없어 업무상 궁금한 점이 생겨도 누구에게 물어봐야 할지 막막했는데, AI 매칭을 통해 커피 한잔 나누며 선배 동료를 알게 되어 질문하는 심리적 장벽이 완전히 사라졌습니다."
            </p>
          </div>
        </div>

        {/* Right: Academic Research & Risk Management Guardrails (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Research Basis (Item 10) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                학술 연구 및 데이터 근거
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">
                  동료 관계와 지식 공유 (J. of Knowledge Management 2024)
                </span>
                <p className="text-[11px] text-slate-500">
                  직장 내 친밀한 동료 관계가 자발적 지식 공유 행동에 유의미한 양의 상관관계를 가짐을 실증.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">
                  동료 간 신뢰와 목표 상호의존성 (국내 연구 2021)
                </span>
                <p className="text-[11px] text-slate-500">
                  동료에 대한 신뢰와 공동 목표 인식이 업무 비효율을 줄이고 문제 해결 속도를 증대시킴.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">
                  AI 활용 네트워크 보완 (2025 학술대회)
                </span>
                <p className="text-[11px] text-slate-500">
                  AI가 기존 인적 네트워크가 부족한 직원의 온보딩과 학습을 효과적으로 보완.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Management Guardrails (Item 12) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                리스크 관리 및 안전장치 5원칙
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-800">개인정보 최소 수집 (PII 보호):</strong>
                  <span className="text-slate-600 block">
                    업무 및 취미 정보만 활용, 비공개 권한 통제
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-800">정중한 거절권(Soft Decline) 보장:</strong>
                  <span className="text-slate-600 block">
                    바쁜 일정 시 눈치 보지 않고 패스 가능
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-800">추천 편향 방지 알고리즘:</strong>
                  <span className="text-slate-600 block">
                    특정 부서/직무 쏠림 없는 고른 추천 가중치
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-slate-800">일정 불일치 방지:</strong>
                  <span className="text-slate-600 block">
                    상호 가능 시간대 사전 매칭 및 20~30분 숏세션
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <strong className="text-slate-800">일회성 방지 피드백 루프:</strong>
                  <span className="text-slate-600 block">
                    만남 후기 분석 및 지속적 후속 교류 모임 안내
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
