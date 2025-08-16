// 진로 문장 관련 타입 정의
export interface CareerSentenceGroup {
  id: string;
  timestamp: Date;
  sentences: string[];
  inputData?: {
    careerField: string;
    activity: string;
    aspiration: string;
  };
}

// 진로 문장 생성 요청 데이터 타입
export interface CareerSentenceGenerationData {
  careerField: string;
  activity: string;
  aspiration: string;
  file?: File;
}