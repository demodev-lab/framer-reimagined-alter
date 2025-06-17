
// 실제 프로덕션에서는 OCR API나 PDF 파싱 라이브러리를 사용해야 합니다
// 여기서는 시뮬레이션을 위한 코드입니다

export interface SubjectTopic {
  subject: string;
  topics: string[];
}

export interface GradeData {
  grade: number;
  subjects: SubjectTopic[];
}

// 텍스트에서 탐구 주제를 추출하는 함수 (시뮬레이션)
export const extractResearchTopics = (text: string): GradeData[] => {
  // 실제로는 AI나 정규식을 사용하여 텍스트에서 탐구 주제를 추출
  // 여기서는 데모용 데이터를 반환합니다
  
  const mockData: GradeData[] = [
    {
      grade: 1,
      subjects: [
        {
          subject: "국어",
          topics: [
            "한글의 창제 과정과 언어학적 특징 연구",
            "현대 소설의 서술 기법 분석"
          ]
        },
        {
          subject: "수학",
          topics: [
            "피보나치 수열의 황금비와 자연 현상 연관성",
            "확률과 통계를 활용한 게임 이론 분석"
          ]
        },
        {
          subject: "과학",
          topics: [
            "친환경 에너지원으로서의 수소 연료전지 연구",
            "미세플라스틱이 해양 생태계에 미치는 영향"
          ]
        }
      ]
    },
    {
      grade: 2,
      subjects: [
        {
          subject: "국어",
          topics: [
            "디지털 시대의 언어 변화와 소통 방식 연구",
            "고전 문학 작품의 현대적 재해석"
          ]
        },
        {
          subject: "수학",
          topics: [
            "인공지능 알고리즘의 수학적 원리 탐구",
            "기하학적 패턴을 활용한 건축 설계 연구"
          ]
        },
        {
          subject: "과학",
          topics: [
            "CRISPR 유전자 편집 기술의 윤리적 고찰",
            "기후 변화가 생물 다양성에 미치는 영향 분석"
          ]
        },
        {
          subject: "사회",
          topics: [
            "디지털 격차 해소를 위한 정책 방안 연구",
            "지속 가능한 도시 개발 모델 분석"
          ]
        }
      ]
    }
  ];

  return mockData;
};

// 파일에서 텍스트를 추출하는 함수 (시뮬레이션)
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // 실제로는 PDF 파싱이나 OCR API를 사용
    setTimeout(() => {
      resolve("생활기록부 텍스트 추출 완료 (시뮬레이션)");
    }, 2000);
  });
};
