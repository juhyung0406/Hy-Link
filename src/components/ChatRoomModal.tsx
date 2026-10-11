import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Coffee, 
  Sparkles, 
  Calendar, 
  ArrowLeft,
  CheckCheck,
  Users,
  User,
  MessageSquare
} from 'lucide-react';
import { MatchResult, ChatMessage, MatchMember } from '../types';
import { INITIAL_COLLEAGUES } from '../data/mockColleagues';
import { ImageEnlargeModal } from './ImageEnlargeModal';
import { useAppTheme } from '../theme/ThemeContext';

interface ChatRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  peer: MatchResult;
  peerAvatar?: string;
  meetingTime?: string;
  isGroup?: boolean;
  groupMembers?: MatchMember[];
}

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  isOpen,
  onClose,
  peer,
  peerAvatar = INITIAL_COLLEAGUES[0]?.avatar,
  meetingTime = '이번 주 목요일 13:00 (사내 카페 8층)',
  isGroup = false,
  groupMembers = [],
}) => {
  const { theme } = useAppTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ url: string; name: string; dept?: string; mbti?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGroupChat = isGroup || peer.isGroup;

  // Default group members if none provided for group mode
  const effectiveGroupMembers: MatchMember[] = groupMembers.length > 0 
    ? groupMembers 
    : [
        {
          id: INITIAL_COLLEAGUES[0]?.id || 'emp_001',
          name: INITIAL_COLLEAGUES[0]?.name || '이경민',
          avatar: INITIAL_COLLEAGUES[0]?.avatar,
          department: INITIAL_COLLEAGUES[0]?.department || '피플&컬처(HR)팀',
          jobTitle: INITIAL_COLLEAGUES[0]?.jobTitle || '선임 매니저',
        },
        {
          id: INITIAL_COLLEAGUES[1]?.id || 'emp_002',
          name: INITIAL_COLLEAGUES[1]?.name || '이소현',
          avatar: INITIAL_COLLEAGUES[1]?.avatar,
          department: INITIAL_COLLEAGUES[1]?.department || '글로벌마케팅팀',
          jobTitle: INITIAL_COLLEAGUES[1]?.jobTitle || '책임 매니저',
        },
        {
          id: INITIAL_COLLEAGUES[2]?.id || 'emp_003',
          name: INITIAL_COLLEAGUES[2]?.name || '오상윤',
          avatar: INITIAL_COLLEAGUES[2]?.avatar,
          department: INITIAL_COLLEAGUES[2]?.department || '차세대선행연구팀',
          jobTitle: INITIAL_COLLEAGUES[2]?.jobTitle || '선임 연구원',
        },
      ];

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isGroupChat) {
        setMessages([
          {
            id: 'msg_g1',
            sender: 'peer',
            senderName: `${effectiveGroupMembers[0]?.name || '이경민'} 선임 (${effectiveGroupMembers[0]?.department || 'HR팀'})`,
            senderAvatar: effectiveGroupMembers[0]?.avatar,
            text: '반갑습니다 여러분! 이번 One Team 4인 소모임 함께하게 되어 기대됩니다 ☕',
            timestamp: '오전 10:15',
          },
          {
            id: 'msg_g2',
            sender: 'peer',
            senderName: `${effectiveGroupMembers[1]?.name || '이소현'} 책임 (${effectiveGroupMembers[1]?.department || '글로벌마케팅팀'})`,
            senderAvatar: effectiveGroupMembers[1]?.avatar,
            text: '안녕하세요! 다채로운 부서 분들과 편하게 이야기 나눠보고 싶었어요 ㅎㅎ',
            timestamp: '오전 10:17',
          },
          {
            id: 'msg_g3',
            sender: 'peer',
            senderName: `${effectiveGroupMembers[2]?.name || '오상윤'} 선임 (${effectiveGroupMembers[2]?.department || '연구팀'})`,
            senderAvatar: effectiveGroupMembers[2]?.avatar,
            text: `약속 일정(${meetingTime})에 맞춰 모이시면 좋을 것 같아요!`,
            timestamp: '오전 10:20',
          },
        ]);
      } else {
        const cleanAvatar = peerAvatar && !peerAvatar.includes('unsplash') ? peerAvatar : INITIAL_COLLEAGUES[0]?.avatar;
        setMessages([
          {
            id: 'msg_1',
            sender: 'peer',
            senderName: peer.candidateName,
            senderAvatar: cleanAvatar,
            text: `안녕하세요! One Team 매칭으로 연결되어 기쁩니다 😊 편하게 커피 한잔하며 이야기 나누어요!`,
            timestamp: '오전 10:25',
          },
          {
            id: 'msg_2',
            sender: 'peer',
            senderName: peer.candidateName,
            senderAvatar: cleanAvatar,
            text: `약속된 일정(${meetingTime})에 뵙겠습니다. 혹시 시간 변동 필요하시면 편하게 말씀해주세요!`,
            timestamp: '오전 10:26',
          },
        ]);
      }
    }
  }, [isOpen, peer.candidateId, meetingTime, isGroupChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = isGroupChat
    ? [
        `안녕하세요 여러분! 이번 주 목요일 라운지에서 봬요 ☕`,
        `다들 서로 다른 부서라 더 재미있는 이야기 나눌 수 있을 것 같아요!`,
        `점심 식사 후에 가볍게 20분 티타임 가지면 딱 좋겠네요 👍`,
      ]
    : [
        `안녕하세요 ${peer.candidateName}님! 커피챗 기대됩니다 ☕`,
        `혹시 평소 좋아하시는 원두나 커피 취향이 있으신가요?`,
        `${peer.department} 실무 이야기 편하게 듣고 싶습니다!`,
      ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      senderName: '나',
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate realistic response
    setTimeout(() => {
      if (isGroupChat) {
        const randomMember = effectiveGroupMembers[Math.floor(Math.random() * effectiveGroupMembers.length)];
        const groupReplies = [
          `좋습니다! 그때 봬요~`,
          `네 확인했습니다! 기대되네요 ㅎㅎ`,
          `시간 맞춰 라운지 2층 카페테리아 앞 테이블로 모이면 될 것 같아요!`,
        ];
        const randomReply = groupReplies[Math.floor(Math.random() * groupReplies.length)];

        const peerReply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          sender: 'peer',
          senderName: `${randomMember.name} (${randomMember.department})`,
          senderAvatar: randomMember.avatar,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
        setMessages((prev) => [...prev, peerReply]);
      } else {
        const peerResponses = [
          `네, 너무 좋아요! 저도 그 주제 정말 흥미롭게 생각하고 있었어요.`,
          `반갑습니다! 맛있는 커피 마시면서 편하게 이런저런 이야기 나눠요 👍`,
          `네 확인했습니다! 말씀해주신 내용 염두에 두고 커피챗 준비해 갈게요 😊`,
        ];
        const randomResponse = peerResponses[Math.floor(Math.random() * peerResponses.length)];

        const peerReply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          sender: 'peer',
          senderName: peer.candidateName,
          senderAvatar: peerAvatar,
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
        setMessages((prev) => [...prev, peerReply]);
      }
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md h-[90vh] sm:h-[820px] ${theme.bgCanvas} rounded-3xl border ${theme.borderPrimary} shadow-2xl flex flex-col overflow-hidden`}>
        {/* Chat Header */}
        <header className={`px-4 py-3 ${theme.headerBg} border-b ${theme.borderPrimary} flex items-center justify-between shadow-2xs`}>
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-slate-600 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Group or 1:1 Avatar & Info */}
            {isGroupChat ? (
              <div className="flex items-center space-x-2.5 min-w-0">
                {/* Overlapping Avatars for Group */}
                <div className="flex -space-x-2 shrink-0">
                  {effectiveGroupMembers.slice(0, 3).map((m, i) => (
                    <img
                      key={i}
                      src={m.avatar}
                      alt={m.name}
                      onClick={() => setEnlargedPhoto({ url: m.avatar, name: m.name, dept: m.department })}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-2xs cursor-pointer hover:scale-110 hover:z-10 transition-transform"
                      title={`${m.name} 님의 사진 크게 보기 (확대)`}
                    />
                  ))}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className={`text-sm sm:text-base font-black ${theme.textPrimary} truncate`}>
                      {peer.groupTitle || 'One Team 4인 소모임 단체방'}
                    </h3>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded border border-indigo-200 shrink-0 flex items-center space-x-0.5">
                      <Users className="w-2.5 h-2.5" />
                      <span>{effectiveGroupMembers.length + 1}명</span>
                    </span>
                  </div>
                  <p className={`text-[10px] ${theme.textMuted} truncate`}>
                    {effectiveGroupMembers.map((m) => m.name).join(', ')}, 나
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 min-w-0">
                <div 
                  onClick={() => setEnlargedPhoto({ 
                    url: peerAvatar && !peerAvatar.includes('unsplash') ? peerAvatar : INITIAL_COLLEAGUES[0]?.avatar, 
                    name: peer.candidateName, 
                    dept: peer.department 
                  })}
                  className="relative shrink-0 cursor-pointer active:scale-95 transition-transform group"
                  title="사진 클릭하여 크게 보기 (확대)"
                >
                  <img
                    src={peerAvatar && !peerAvatar.includes('unsplash') ? peerAvatar : INITIAL_COLLEAGUES[0]?.avatar}
                    alt={peer.candidateName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#FFA070] group-hover:scale-105 transition-transform"
                  />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-2xs" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className={`text-sm sm:text-base font-black ${theme.textPrimary} truncate`}>
                      {peer.candidateName} 님
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                      수락 완료
                    </span>
                  </div>
                  <p className={`text-[11px] ${theme.textMuted} truncate`}>
                    {peer.department} · {peer.jobTitle}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Schedule & Meeting Info Pinned Banner */}
        <div className={`px-4 py-2.5 bg-gradient-to-r from-[#FFF0E2] to-[#FFF5ED] border-b ${theme.borderPrimary} flex items-center justify-between text-xs`}>
          <div className="flex items-center space-x-2 text-[#5A3E36] font-medium truncate">
            <Calendar className="w-4 h-4 text-[#FFA070] shrink-0" />
            <span className="truncate"><strong>약속 일정:</strong> {meetingTime}</span>
          </div>
          <span className="text-[10px] font-black text-[#D86E38] bg-white px-2.5 py-0.5 rounded-full border border-[#FFA070]/30 shrink-0">
            {isGroupChat ? '👥 단체 모임 조율중' : '☕ 1:1 커피챗'}
          </span>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Date Divider */}
          <div className="flex items-center justify-center my-1">
            <span className="text-[10px] font-medium bg-black/5 text-slate-500 px-3 py-0.5 rounded-full">
              {isGroupChat ? '👥 단체방이 개설되었습니다' : '1:1 대화 시작'}
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar || peerAvatar}
                    alt={msg.senderName || peer.candidateName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mb-1 border border-slate-200"
                  />
                )}
                <div className={`max-w-[78%] space-y-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name in Group Chat */}
                  {!isMe && isGroupChat && msg.senderName && (
                    <span className="text-[10px] font-bold text-slate-600 block pl-1">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? `${theme.gradientButton} text-white rounded-br-xs`
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end space-x-1 text-[9px] mt-1 ${
                        isMe ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-white/90" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Icebreaker Suggestions */}
        <div className={`px-3 py-2 ${theme.bgSurfaceSecondary} border-t ${theme.borderPrimary}`}>
          <div className="flex items-center space-x-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-[#FFA070]" />
            <span className="text-[10px] font-bold text-slate-600">
              {isGroupChat ? '단체방 원클릭 인사말:' : '원클릭 추천 아이스브레이킹 질문:'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[11px] text-[#5A3E36] font-medium whitespace-nowrap transition-all shadow-2xs hover:border-[#FFA070]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className={`p-3 ${theme.headerBg} border-t ${theme.borderPrimary}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isGroupChat ? '단체방에 메시지를 남겨보세요...' : '따뜻한 메시지를 입력해보세요...'}
              className={`flex-1 px-4 py-2.5 text-xs rounded-xl border ${theme.borderPrimary} bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFA070]`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-xl ${theme.gradientButton} disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <ImageEnlargeModal
          isOpen={!!enlargedPhoto}
          onClose={() => setEnlargedPhoto(null)}
          imageUrl={enlargedPhoto.url}
          name={enlargedPhoto.name}
          department={enlargedPhoto.dept}
        />
      )}
    </div>
  );
};
