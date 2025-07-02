// N8N 웹훅으로부터 받는 프로젝트 데이터 타입 정의

export interface ProjectGuideline {
  프로젝트_주제명: string;
  내용_가이드라인: {
    사전_조사: string;
    핵심_활동: string;
  };
  연관_교과목_및_개념: string[];
  배울_툴_프로그램: string[];
}

export interface SemesterProjectData {
  "1학년 1학기": ProjectGuideline;
  "1학년 2학기": ProjectGuideline;
  "2학년 1학기": ProjectGuideline;
  "2학년 2학기": ProjectGuideline;
  "3학년 1학기": ProjectGuideline;
}

export interface N8NWebhookResponse {
  학기별_프로젝트_가이드라인: SemesterProjectData;
}

// 기존 topicRow에 추가될 상세 정보
export interface DetailedProjectInfo {
  주제명: string;
  사전_조사: string;
  핵심_활동: string;
  연관_교과목: string[];
  사용_도구: string[];
}