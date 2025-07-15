// N8N 웹훅으로부터 받은 탐구 방법 데이터를 파싱하는 유틸리티

export interface ParsedResearchMethod {
  탐구주제: string;
  탐구목표: {
    주요목표: string;
    세부목표: string[];
  };
  탐구가설: string;
  필요한준비물: Array<{
    항목: string;
    사용목적: string;
    설명: string;
    대체준비물?: string;
  }>;
  단계별프로토콜: {
    [category: string]: Array<{
      단계?: string;
      항목?: string;
      상세설명: string;
      입력내용?: string;
    }>;
  };
  데이터분석및결과도출?: {
    분석방법?: string[];
    결과도출?: string[];
  };
  주의사항?: {
    실험과정에서의주의사항?: string[];
    예상문제와해결책?: Array<{
      문제: string;
      해결책: string;
    }>;
  };
  참고자료?: Array<{
    제목: string;
    설명: string;
    링크: string;
  }>;
}

export function parseN8NResearchMethods(data: any): ParsedResearchMethod[] {
  try {
    console.log('🔍 N8N 데이터 파싱 시작:', data);
    
    // 데이터가 배열인지 확인
    let researchData = Array.isArray(data) ? data : [data];
    
    return researchData.map((item: any) => {
      // 각 필드를 안전하게 파싱
      return {
        탐구주제: item['탐구 주제'] || item.탐구주제 || '탐구 주제 정보 없음',
        탐구목표: {
          주요목표: item['탐구 목표']?.['주요 목표'] || item.탐구목표?.주요목표 || '목표 정보 없음',
          세부목표: item['탐구 목표']?.['세부 목표'] || item.탐구목표?.세부목표 || []
        },
        탐구가설: item['탐구 가설'] || item.탐구가설 || '가설 정보 없음',
        필요한준비물: item['필요한 준비물'] || item.필요한준비물 || [],
        단계별프로토콜: item['단계별 프로토콜'] || item.단계별프로토콜 || {},
        데이터분석및결과도출: item['데이터 분석 및 결과 도출'] || item.데이터분석및결과도출,
        주의사항: item['주의사항'] || item.주의사항,
        참고자료: item['참고 자료'] || item.참고자료 || []
      };
    });
  } catch (error) {
    console.error('N8N 데이터 파싱 오류:', error);
    return [];
  }
}

export function formatResearchMethodForDisplay(methods: ParsedResearchMethod[]): string[] {
  if (!methods || methods.length === 0) {
    return ['탐구 방법 데이터를 불러올 수 없습니다.'];
  }

  const formatted: string[] = [];

  methods.forEach((method, index) => {
    if (methods.length > 1) {
      formatted.push(`=== 탐구 방법 ${index + 1} ===`);
    }

    // 탐구 주제
    formatted.push(`📋 **탐구 주제**`);
    formatted.push(method.탐구주제);
    formatted.push('');

    // 탐구 목표
    formatted.push(`🎯 **탐구 목표**`);
    formatted.push(`**주요 목표:** ${method.탐구목표.주요목표}`);
    if (method.탐구목표.세부목표.length > 0) {
      formatted.push(`**세부 목표:**`);
      method.탐구목표.세부목표.forEach((goal, i) => {
        formatted.push(`${i + 1}. ${goal}`);
      });
    }
    formatted.push('');

    // 탐구 가설
    formatted.push(`💡 **탐구 가설**`);
    formatted.push(method.탐구가설);
    formatted.push('');

    // 필요한 준비물
    if (method.필요한준비물.length > 0) {
      formatted.push(`🛠️ **필요한 준비물**`);
      method.필요한준비물.forEach((item, i) => {
        formatted.push(`**${i + 1}. ${item.항목}**`);
        formatted.push(`- 목적: ${item.사용목적}`);
        formatted.push(`- 설명: ${item.설명}`);
        if (item.대체준비물) {
          formatted.push(`- 대체 준비물: ${item.대체준비물}`);
        }
        formatted.push('');
      });
    }

    // 단계별 프로토콜
    if (Object.keys(method.단계별프로토콜).length > 0) {
      formatted.push(`📝 **단계별 프로토콜**`);
      Object.entries(method.단계별프로토콜).forEach(([category, steps]) => {
        formatted.push(`**${category}**`);
        steps.forEach((step, i) => {
          const title = step.단계 || step.항목 || `단계 ${i + 1}`;
          formatted.push(`**${title}**`);
          formatted.push(step.상세설명);
          if (step.입력내용) {
            formatted.push(`세부 내용: ${step.입력내용}`);
          }
          formatted.push('');
        });
      });
    }

    // 데이터 분석 및 결과 도출
    if (method.데이터분석및결과도출) {
      formatted.push(`📊 **데이터 분석 및 결과 도출**`);
      
      if (method.데이터분석및결과도출.분석방법) {
        formatted.push(`**분석 방법:**`);
        method.데이터분석및결과도출.분석방법.forEach((method, i) => {
          formatted.push(`${i + 1}. ${method}`);
        });
        formatted.push('');
      }

      if (method.데이터분석및결과도출.결과도출) {
        formatted.push(`**결과 도출:**`);
        method.데이터분석및결과도출.결과도출.forEach((result, i) => {
          formatted.push(`${i + 1}. ${result}`);
        });
        formatted.push('');
      }
    }

    // 주의사항
    if (method.주의사항) {
      formatted.push(`⚠️ **주의사항**`);
      
      if (method.주의사항.실험과정에서의주의사항) {
        formatted.push(`**실험 과정에서의 주의사항:**`);
        method.주의사항.실험과정에서의주의사항.forEach((caution, i) => {
          formatted.push(`${i + 1}. ${caution}`);
        });
        formatted.push('');
      }

      if (method.주의사항.예상문제와해결책) {
        formatted.push(`**예상 문제와 해결책:**`);
        method.주의사항.예상문제와해결책.forEach((item, i) => {
          formatted.push(`**문제 ${i + 1}:** ${item.문제}`);
          formatted.push(`**해결책:** ${item.해결책}`);
          formatted.push('');
        });
      }
    }

    // 참고 자료
    if (method.참고자료.length > 0) {
      formatted.push(`📚 **참고 자료**`);
      method.참고자료.forEach((ref, i) => {
        formatted.push(`**${i + 1}. ${ref.제목}**`);
        formatted.push(`${ref.설명}`);
        formatted.push(`링크: ${ref.링크}`);
        formatted.push('');
      });
    }

    if (methods.length > 1 && index < methods.length - 1) {
      formatted.push('---');
      formatted.push('');
    }
  });

  return formatted;
}