import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface DetailedProjectCardProps {
  주제명: string;
  사전_조사?: string;
  핵심_활동?: string;
  연관_교과목?: string[];
  사용_도구?: string[];
}

const DetailedProjectCard: React.FC<DetailedProjectCardProps> = ({
  주제명,
  사전_조사,
  핵심_활동,
  연관_교과목 = [],
  사용_도구 = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // N8N 데이터가 있으면 무조건 표시 (빈 문자열이라도 표시)
  const hasDetailedInfo = true;

  const renderTags = (items: string[], bgColor: string, textColor: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span 
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderLongText = (text: string, maxLines: number = 4) => {
    if (!text) return null;
    
    return (
      <div className="relative">
        <p className={`text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-lg border-l-4 border-blue-400 whitespace-pre-wrap`}>
          {text}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
      {/* 헤더 영역 - 주제명 */}
      <div className="mb-6">
        <h4 className="font-bold text-xl mb-3 flex items-center text-gray-900">
          <span className="mr-3 text-2xl">📋</span>
          프로젝트 주제
        </h4>
        <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
          <p className="text-gray-800 text-base leading-relaxed font-medium">{주제명}</p>
        </div>
      </div>

      {hasDetailedInfo && (
        <>
          {/* 토글 버튼 */}
          <div className="mb-6">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="default"
              className="w-full flex items-center justify-center gap-3 h-12 text-sm font-medium bg-white border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
            >
              <Eye size={18} />
              {isExpanded ? '상세 정보 접기' : '상세 정보 보기'}
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>

          {/* 상세 정보 섹션 */}
          {isExpanded && (
            <div className="space-y-6 border-t border-gray-200 pt-6">
              {/* 사전 조사 */}
              <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
                <h5 className="font-bold text-lg mb-4 flex items-center text-blue-800">
                  <span className="mr-3 text-xl">🔍</span>
                  사전 조사
                </h5>
                {renderLongText(사전_조사 || 'N8N에서 데이터를 받아오는 중입니다...')}
              </div>

              {/* 핵심 활동 */}
              <div className="bg-white rounded-lg p-5 border border-green-100 shadow-sm">
                <h5 className="font-bold text-lg mb-4 flex items-center text-green-800">
                  <span className="mr-3 text-xl">⚙️</span>
                  핵심 활동
                </h5>
                <div className="relative">
                  <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-lg border-l-4 border-green-400 whitespace-pre-wrap">
                    {핵심_활동 || 'N8N에서 데이터를 받아오는 중입니다...'}
                  </p>
                </div>
              </div>

              {/* 연관 교과목 */}
              <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
                <h5 className="font-bold text-lg mb-4 flex items-center text-blue-800">
                  <span className="mr-3 text-xl">📚</span>
                  연관 교과목
                </h5>
                <div className="flex flex-wrap gap-3">
                  {연관_교과목 && 연관_교과목.length > 0 ? (
                    연관_교과목.map((item, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">N8N에서 데이터를 받아오는 중입니다...</span>
                  )}
                </div>
              </div>

              {/* 사용 도구 */}
              <div className="bg-white rounded-lg p-5 border border-purple-100 shadow-sm">
                <h5 className="font-bold text-lg mb-4 flex items-center text-purple-800">
                  <span className="mr-3 text-xl">🛠️</span>
                  사용 도구
                </h5>
                <div className="flex flex-wrap gap-3">
                  {사용_도구 && 사용_도구.length > 0 ? (
                    사용_도구.map((item, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">N8N에서 데이터를 받아오는 중입니다...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default DetailedProjectCard;