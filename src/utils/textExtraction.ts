
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

// 파일 이름과 크기를 기반으로 다른 결과를 생성하는 함수
const generateVariedData = (fileName: string, fileSize: number): GradeData[] => {
  console.log(`파일 분석 중: ${fileName} (크기: ${fileSize} bytes)`);
  
  // 파일 이름의 해시값을 기반으로 다른 데이터 세트 선택
  const nameHash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sizeVariation = Math.floor(fileSize / 1000) % 3;
  const variation = (nameHash + sizeVariation) % 4;
  
  const dataSets: GradeData[][] = [
    // 데이터 세트 1 - 이과 중심
    [
      {
        grade: 1,
        subjects: [
          {
            subject: "수학",
            topics: [
              "미적분학의 실생활 응용 사례 연구",
              "통계를 활용한 빅데이터 분석 프로젝트"
            ]
          },
          {
            subject: "물리",
            topics: [
              "뉴턴 역학과 상대성 이론의 차이점 탐구",
              "양자역학의 기본 원리와 현대 기술 응용"
            ]
          },
          {
            subject: "화학",
            topics: [
              "친환경 화학 반응을 이용한 신소재 개발",
              "분자 구조와 물질의 성질 관계 분석"
            ]
          }
        ]
      }
    ],
    // 데이터 세트 2 - 문과 중심
    [
      {
        grade: 2,
        subjects: [
          {
            subject: "국어",
            topics: [
              "현대 문학 작품의 사회적 배경 분석",
              "언어의 변화와 소통의 진화 연구"
            ]
          },
          {
            subject: "사회",
            topics: [
              "민주주의 발전 과정과 시민 참여",
              "경제 시스템의 변화와 사회 불평등"
            ]
          },
          {
            subject: "역사",
            topics: [
              "근현대사 속 인물들의 선택과 결과",
              "문화 교류가 역사에 미친 영향"
            ]
          }
        ]
      }
    ],
    // 데이터 세트 3 - 예체능 중심
    [
      {
        grade: 1,
        subjects: [
          {
            subject: "미술",
            topics: [
              "디지털 아트와 전통 미술의 융합",
              "색채 심리학과 감정 표현 연구"
            ]
          },
          {
            subject: "음악",
            topics: [
              "음향학과 음악 치료의 과학적 원리",
              "세계 음악 문화의 다양성과 공통점"
            ]
          },
          {
            subject: "체육",
            topics: [
              "스포츠 과학과 운동 능력 향상 방법",
              "팀워크와 리더십 개발을 위한 체육 활동"
            ]
          }
        ]
      }
    ],
    // 데이터 세트 4 - 종합형
    [
      {
        grade: 1,
        subjects: [
          {
            subject: "과학",
            topics: [
              "기후 변화와 지속 가능한 에너지 연구",
              "생명과학과 의료 기술의 발전"
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
              "매체 언어와 디지털 문해력",
              "창작과 표현의 다양한 방법 탐구"
            ]
          },
          {
            subject: "수학",
            topics: [
              "확률과 게임 이론의 실제 응용",
              "기하학적 패턴과 자연 현상의 연관성"
            ]
          }
        ]
      }
    ]
  ];
  
  return dataSets[variation] || dataSets[0];
};

// 텍스트에서 탐구 주제를 추출하는 함수 (시뮬레이션)
export const extractResearchTopics = (text: string, fileName: string = "", fileSize: number = 0): GradeData[] => {
  console.log("탐구 주제 추출 시작:", { text: text.substring(0, 50) + "...", fileName, fileSize });
  
  // 실제로는 AI나 정규식을 사용하여 텍스트에서 탐구 주제를 추출
  // 여기서는 파일 정보를 기반으로 다양한 데모용 데이터를 반환합니다
  const result = generateVariedData(fileName, fileSize);
  
  console.log("추출된 탐구 주제:", result);
  return result;
};

// 파일에서 텍스트를 추출하는 함수 (시뮬레이션)
export const extractTextFromFile = async (file: File): Promise<string> => {
  console.log("파일에서 텍스트 추출 시작:", file.name, file.size);
  
  return new Promise((resolve) => {
    // 실제로는 PDF 파싱이나 OCR API를 사용
    setTimeout(() => {
      const extractedText = `${file.name}에서 추출된 생활기록부 텍스트 (${file.size} bytes) - 시뮬레이션`;
      console.log("텍스트 추출 완료:", extractedText);
      resolve(extractedText);
    }, 2000);
  });
};
