import React from 'react';

interface HyLinkLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const HyLinkLogo: React.FC<HyLinkLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 34 : size === 'md' ? 44 : 56;

  return (
    <div className={`inline-flex items-center space-x-2.5 select-none ${className}`}>
      {/* Icon Squircle Badge based on user uploaded image */}
      <div 
        className="relative rounded-2xl flex items-center justify-center shrink-0 border border-[#F3E5D4]"
        style={{
          width: iconSize,
          height: iconSize,
          background: 'linear-gradient(145deg, #FFF5EB 0%, #FDF0E3 100%)',
          boxShadow: '0 3px 12px -1px rgba(90, 62, 54, 0.08), 0 1px 3px rgba(255, 158, 108, 0.1)'
        }}
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full p-0.5"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Peach Spark rays above 'k' */}
          <ellipse cx="89" cy="37" rx="3.5" ry="5.5" transform="rotate(-15 89 37)" fill="#FFA070" />
          <ellipse cx="98" cy="42" rx="3" ry="5" transform="rotate(45 98 42)" fill="#FFA070" />

          {/* Wordmark: Hy-Link in warm mocha chocolate (#5A3E36) */}
          <text 
            x="17" 
            y="66" 
            fontFamily="'Pretendard', system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="32" 
            letterSpacing="-0.5"
            fill="#5A3E36"
          >
            Hy
          </text>
          <text 
            x="53" 
            y="64" 
            fontFamily="'Pretendard', system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="28" 
            fill="#5A3E36"
          >
            -
          </text>
          <text 
            x="64" 
            y="66" 
            fontFamily="'Pretendard', system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="32" 
            letterSpacing="-0.5"
            fill="#5A3E36"
          >
            Link
          </text>

          {/* Warm Apricot Peach Smile Arc (#FFA070) */}
          <path 
            d="M 32 78 Q 59 95 86 76" 
            stroke="#FFA070" 
            strokeWidth="6" 
            strokeLinecap="round" 
            fill="none" 
          />
        </svg>
      </div>

      {/* Brand Text Details */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5 leading-none">
          <span 
            className="font-black tracking-tight text-[#5A3E36]"
            style={{ 
              fontSize: size === 'sm' ? '16px' : size === 'md' ? '19px' : '23px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Hy-Link
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FFF0E2] text-[#D86E38] border border-[#FAD6BC]">
            하이닉스
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-[#8C766B] font-medium mt-0.5">
            이천캠퍼스 동료 매칭
          </span>
        )}
      </div>
    </div>
  );
};
