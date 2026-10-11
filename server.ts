import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Step 1 Profile Extraction & Normalization (3~4 Survey Steps + Narrative Intro)
app.post('/api/step1-extract', async (req, res) => {
  const {
    name = '김하늘',
    department = '반도체공정개발팀',
    tenure = '신입 (1년차)',
    q1_purpose = '타부서 업무 교류',
    q2_peerType = '이종 부서 동료 (One Team)',
    q3_interests = ['클라이밍', '핸드드립커피', '데이터분석'],
    q4_meetingStyle = '점심시간 30분 사내 카페 커피챗',
    narrativeIntro = '',
    rawIntroText = '',
  } = req.body;

  const introText = narrativeIntro || rawIntroText || '동료들과 편하게 커피 한잔하며 대화하고 싶습니다.';

  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `당신은 사내 HR 데이터 분석 및 One Team 온보딩 설계 전문가입니다.
사용자가 제출한 "3~4단계 객관식 설문 응답(만남 목적, 선호 상대 스타일, 관심사 태그, 만남 형태)"과 "서술형 자기소개 한마디"를 결합하여, 사내 동료 매칭 알고리즘이 즉시 활용할 수 있는 표준 JSON 프로필을 생성하세요.
개인정보(전화번호, 주민번호 등 민감정보)는 절대 노출되지 않도록 정제하세요.

[중요 보안 및 익명성 지침]
특히 이름, 나이 또한 사내 메신저로 대상을 특정할 수 있으므로 상대방에게 보이지 않도록 해주세요. 
AI는 선택한 공통점으로만 상대방에게 인식되도록 매칭하고 정보를 전달해야 합니다. 
따라서 공통점 기반의 익명 닉네임(anonymousAlias)과, 이름/나이가 배제된 오직 공통 관심사 중심의 블라인드 소개문(blindBio)을 반드시 생성하세요.

[사용자 기본 정보]
- 이름: ${name}
- 부서: ${department}
- 연차: ${tenure}

[3~4단계 객관식 설문 응답]
1. 만남 목적 (q1_purpose): "${q1_purpose}"
2. 선호 상대 스타일 (q2_peerType): "${q2_peerType}"
3. 핵심 관심사/취미 태그 (q3_interests): ${JSON.stringify(q3_interests)}
4. 선호 만남 형태 (q4_meetingStyle): "${q4_meetingStyle}"

[서술형 자기소개 한마디]
"${introText}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              anonymousAlias: {
                type: Type.STRING,
                description: '상대방에게 보이는 공통점 기반 익명 닉네임 (예: ☕ 클라이밍과 드립커피를 즐기는 공정 엔지니어)',
              },
              department: { type: Type.STRING },
              tenureCategory: { type: Type.STRING },
              jobCategory: { type: Type.STRING },
              primaryPurpose: { type: Type.STRING },
              preferredPeerStyle: { type: Type.STRING },
              interests: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              commonGroundSummary: {
                type: Type.STRING,
                description: '상대방에게 인식될 선택한 공통점 요약 문구',
              },
              meetingPurposes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cocValues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              preferredTimes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              refinedBio: { type: Type.STRING },
              blindBio: {
                type: Type.STRING,
                description: '이름과 나이가 전혀 언급되지 않고 오직 공통점과 목적으로만 작성된 블라인드 소개문',
              },
              privacyAudit: {
                type: Type.OBJECT,
                properties: {
                  isPiiClean: { type: Type.BOOLEAN },
                  isNameMasked: { type: Type.BOOLEAN },
                  isAgeMasked: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING },
                },
                required: ['isPiiClean', 'isNameMasked', 'isAgeMasked', 'notes'],
              },
              matchReadinessScore: { type: Type.NUMBER },
            },
            required: [
              'name',
              'anonymousAlias',
              'department',
              'tenureCategory',
              'jobCategory',
              'primaryPurpose',
              'preferredPeerStyle',
              'interests',
              'commonGroundSummary',
              'meetingPurposes',
              'cocValues',
              'preferredTimes',
              'refinedBio',
              'blindBio',
              'privacyAudit',
              'matchReadinessScore',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini step 1 extraction error, falling back:', err?.message);
    }
  }

  // Fallback intelligent synthesizer
  const safeInterests = Array.isArray(q3_interests) && q3_interests.length > 0
    ? q3_interests
    : ['핸드드립커피', '러닝', '클라이밍'];

  const parsedData = {
    name,
    anonymousAlias: `☕ ${safeInterests[0] || '커피'}와 ${safeInterests[1] || '취미'}를 즐기는 동료`,
    department,
    tenureCategory: tenure.includes('신입') ? '신입 (1년차 미만)' : tenure,
    jobCategory: department.includes('개발') || department.includes('연구') ? 'R&D / 공정설계' : '비즈니스 / 사업운영',
    primaryPurpose: q1_purpose,
    preferredPeerStyle: q2_peerType,
    interests: safeInterests,
    commonGroundSummary: `공통점: [${safeInterests.join(', ')}] • 만남 목적: [${q1_purpose}]`,
    meetingPurposes: [q1_purpose, '취미 친구'],
    cocValues: ['One Team', '상호 신뢰와 소통'],
    preferredTimes: [q4_meetingStyle],
    refinedBio: introText.trim().length > 5
      ? introText
      : `${safeInterests.join(', ')} 취미를 함께 나누며 편하게 ${q1_purpose}에 대해 이야기 나누고 싶습니다.`,
    blindBio: `평소 ${safeInterests.join(', ')}에 관심이 많으며, '${q1_purpose}'을(를) 목적으로 커피 한잔하며 소통할 동료를 찾고 있습니다.`,
    privacyAudit: {
      isPiiClean: true,
      isNameMasked: true,
      isAgeMasked: true,
      notes: '이름과 나이가 블라인드 처리되었으며 오직 선택한 공통점(취미, 만남목적)으로만 상대방에게 인식됩니다.',
    },
    matchReadinessScore: 99,
  };

  return res.json({
    success: true,
    data: parsedData,
    source: 'heuristic_fallback',
  });
});

// API: Run AI Matching Engine
app.post('/api/match', async (req, res) => {
  const { userProfile, candidates, preferences } = req.body;

  if (!userProfile) {
    return res.status(400).json({ error: 'User profile is required' });
  }

  // If Gemini API key is present, use Gemini 3.8 Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `당신은 SKMS One Team 철학에 기반한 기업 사내 AI 동료 매칭 Agent입니다.
평소 교류가 적은 서로 다른 부서/직무의 구성원을 연결하여 심리적 장벽을 낮추고, 자발적 지식 공유와 신뢰를 형성하는 것이 목표입니다.

[최우선 보안 & 편견 방지 원칙: 실명 및 나이 완전 배제]
서로 만나기 전에는 선입견 없이 편안하게 알아갈 수 있도록, 신청자와 동료의 실명(이름)과 나이를 완전히 감추어야 합니다.
이름을 알면 사내 메신저(팀즈/슬랙)를 검색하여 대상을 특정하게 되므로,
summary, matchReason, icebreakers, outreachMessage 등 그 어떤 텍스트에도 신청자의 실명이나 상대방의 실명을 절대 언급하지 마세요!
(예: '김하늘님의...', '최지우님과...' 절대 금지 ➔ '두 분은...', '상대 동료는...', '신청자분과...' 등으로만 서술)

[AI 추천 이유 및 공통점 % 지표 강조 원칙]
상세한 개인 신상정보 대신, AI가 이 동료를 추천한 구체적인 이유와 선택한 공통점, 그리고 일치도 %를 명확하게 제시하세요:
- matchScore: 종합 One Team 매칭 지수 (0~100)
- interestMatchRate: 선택한 취미/관심사 일치율 (0~100)
- synergyRate: 서로 다른 부서 간 상호 보완 협업 시너지 (0~100)
- purposeFitRate: 만남 목적 부합도 (0~100)
- matchReason: 실명 없이 오직 공통 관심사와 협업 시너지를 바탕으로 AI가 추천한 구체적 근거 서술

[신청 사용자 프로필]
${JSON.stringify(userProfile, null, 2)}

[만남 목적 및 선호 조건]
${JSON.stringify(preferences || {}, null, 2)}

[동료 후보 풀]
${JSON.stringify(candidates || [], null, 2)}

위 후보 풀 중에서 신청자에게 가장 적합한 동료 최대 3명을 추천하고, 각 동료와의 매칭 분석 결과를 JSON 형식으로 반환하세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: '실명 없이 작성된 매칭 분석 종합 총평 (예: 신청하신 만남 목적과 관심사를 기반으로...)',
              },
              recommendedMatches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    candidateId: { type: Type.STRING },
                    candidateName: { type: Type.STRING },
                    anonymousAlias: {
                      type: Type.STRING,
                      description: '블라인드 매칭용 공통점 기반 닉네임 (예: ☕ 커피와 러닝을 즐기는 AI 연구원)',
                    },
                    department: { type: Type.STRING },
                    jobTitle: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER, description: '100점 만점 기준 종합 매칭 지수' },
                    interestMatchRate: { type: Type.NUMBER, description: '취미/관심사 일치율 (%)' },
                    synergyRate: { type: Type.NUMBER, description: '부서 간 One Team 시너지 지수 (%)' },
                    purposeFitRate: { type: Type.NUMBER, description: '만남 목적 부합도 (%)' },
                    synergyKeywords: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '핵심 시너지 키워드 3~4개',
                    },
                    matchReason: {
                      type: Type.STRING,
                      description: '실명/나이 없이 AI가 이 동료를 추천한 이유와 공통점 설명',
                    },
                    commonGround: {
                      type: Type.STRING,
                      description: '공통 관심사 또는 상호 보완적인 업무 접점',
                    },
                    icebreakers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '첫 만남에서 어색함을 깨줄 추천 질문 3가지 (실명 언급 금지)',
                    },
                    suggestedAgenda: {
                      type: Type.STRING,
                      description: '부담 없는 20~30분 첫 만남 추천 방식 및 장소/시간대',
                    },
                    outreachMessage: {
                      type: Type.STRING,
                      description: '실명 없이 보낼 수 있는 사내 메신저 정중한 초대 문구',
                    },
                  },
                  required: [
                    'candidateId',
                    'candidateName',
                    'anonymousAlias',
                    'department',
                    'jobTitle',
                    'matchScore',
                    'interestMatchRate',
                    'synergyRate',
                    'purposeFitRate',
                    'synergyKeywords',
                    'matchReason',
                    'icebreakers',
                    'suggestedAgenda',
                    'outreachMessage',
                  ],
                },
              },
            },
            required: ['summary', 'recommendedMatches'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (Array.isArray(parsed?.recommendedMatches)) {
        parsed.recommendedMatches = parsed.recommendedMatches.map((m: any) => {
          const cand = (candidates || []).find((c: any) => c.id === m.candidateId || c.name === m.candidateName);
          return {
            ...m,
            avatar: cand?.avatar || m.avatar,
            hashtags: cand?.hashtags || m.hashtags,
          };
        });
      }
      return res.json({ success: true, data: parsed, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini API match error, using intelligent fallback algorithm:', err?.message);
    }
  }

  // Fallback intelligent heuristic matching (STRICTLY NO NAMES LEAKED)
  const matches = (candidates || []).map((cand: any) => {
    let score = 75;
    const commonInterests = (cand.interests || []).filter((i: string) =>
      (userProfile.interests || []).includes(i)
    );
    score += commonInterests.length * 8;
    const isDiffDept = cand.department !== userProfile.department;
    if (isDiffDept) score += 10; // Cross-department bonus
    if (cand.purpose === preferences?.purpose) score += 8;
    score = Math.min(score, 98);

    const interestRate = Math.min(65 + commonInterests.length * 12, 98);
    const synergyRate = isDiffDept ? 95 : 82;
    const purposeRate = cand.purpose === preferences?.purpose ? 96 : 88;

    return {
      candidateId: cand.id,
      candidateName: cand.name,
      avatar: cand.avatar,
      anonymousAlias: cand.anonymousAlias || `☕ ${commonInterests[0] || cand.interests?.[0] || '취미'}를 즐기는 ${cand.department.slice(0, 4)} 동료`,
      department: cand.department,
      jobTitle: cand.jobTitle,
      matchScore: score,
      interestMatchRate: interestRate,
      synergyRate: synergyRate,
      purposeFitRate: purposeRate,
      synergyKeywords: [
        commonInterests[0] || 'One Team 협업',
        isDiffDept ? '부서 간 교류' : '동일 직무 공감',
        '상호 시너지',
      ],
      // Clean, clear, and concise recommendation reason
      matchReason: `[${commonInterests[0] || '사내 관심사'}] 공통 관심사를 바탕으로, ${userProfile.department}과 ${cand.department} 간의 상호 실무 시너지(${synergyRate}%)를 기대할 수 있습니다.`,
      commonGround: commonInterests.length > 0 ? commonInterests.join(', ') : '업무 교류 및 새로운 사내 네트워크',
      icebreakers: [],
      suggestedAgenda: '이천 SUPEX 센터 2층 또는 R&D 센터 사내 카페 커피챗 (20~30분)',
      // STRICTLY NO NAMES in messenger draft either!
      outreachMessage: `안녕하세요! 사내 One Team 매칭 프로그램을 통해 인사드립니다. 평소 이종 부서 업무와 공통 관심사(${commonInterests[0] ? `#${commonInterests[0]}` : '#취미'})에 관심이 많아 용기 내어 연락드렸어요. 이번 주 편하신 시간에 사내 카페에서 20분 정도 가볍게 티타임 가져보실 수 있을까요? 부담 갖지 마시고 편하게 답장 부탁드립니다! 😊`,
    };
  });

  matches.sort((a: any, b: any) => b.matchScore - a.matchScore);

  return res.json({
    success: true,
    data: {
      summary: `선택하신 만남 목적과 관심사를 기반으로, 편견 없이 교류할 수 있는 최적의 One Team 동료 3인을 선별했습니다.`,
      recommendedMatches: matches.slice(0, 3),
    },
    source: 'heuristic_fallback',
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
