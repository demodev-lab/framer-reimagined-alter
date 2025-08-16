import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import TopicResultsCard from "../TopicResultsCard";
import ResearchMethodsCard from "../ResearchMethodsCard";
import DetailedProjectCard from "./DetailedProjectCard";
import { Button } from "@/components/ui/button";
import { N8NWebhookResponse, DetailedProjectInfo } from "@/types/projectTypes";
interface ProjectTopicCarouselProps {
  group: any;
  followUpStates: {
    [key: string]: boolean;
  };
  onFollowUpChange: (rowId: number, checked: boolean) => void;
  selectedCareerSentence: string | null;
  onGenerate: (
    rowId: number,
    inputs: {
      subject: string;
      concept: string;
      topicType: string;
    }
  ) => void;
  onSelectTopic: (rowId: number, topic: string) => void;
  onRefreshTopic: (rowId: number) => void;
  onLockTopic: (rowId: number) => void;
  onDeleteTopic: (rowId: number) => void;
  onRegenerateMethods: (rowId: number) => void;
  onUpdateResearchMethods?: (rowId: number, methods: string[]) => void;
  onTopicTypeChange: (rowId: number, type: string) => void;
  onCareerSentenceSelect: (sentence: string) => void;
  onAddFollowUpRow: (groupId: number) => void;
  onRegenerateAllTopics: () => void;
  onUpdateTopicsFromWebhook?: (detailedProjects: DetailedProjectInfo[]) => void;
}
const semesterLabels = [
  "1학년 1학기 프로젝트",
  "1학년 2학기 프로젝트",
  "2학년 1학기 프로젝트",
  "2학년 2학기 프로젝트",
  "3학년 1학기 프로젝트",
];
const ProjectTopicCarousel: React.FC<ProjectTopicCarouselProps> = ({
  group,
  followUpStates,
  onFollowUpChange,
  selectedCareerSentence,
  onGenerate,
  onSelectTopic,
  onRefreshTopic,
  onLockTopic,
  onDeleteTopic,
  onRegenerateMethods,
  onUpdateResearchMethods,
  onTopicTypeChange,
  onCareerSentenceSelect,
  onAddFollowUpRow,
  onRegenerateAllTopics,
  onUpdateTopicsFromWebhook,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp =
    lastRow?.stage === "topic_selected" && lastRow?.selectedTopic;

  // Track slide changes using the carousel API
  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      setCurrentSlideIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api?.off("select", onSelect);
    };
  }, [api]);
  const handleBackToGenerator = (rowId: number) => {
    onDeleteTopic(rowId);
  };

  // n8n 웹훅을 통한 프로젝트 주제 생성 (첫 생성 및 재생성 공통)
  const handleGenerateTopicsWithWebhook = async () => {
    if (!selectedCareerSentence || isRegenerating) {
      return;
    }

    setIsRegenerating(true);
    setRegenerateError(null);
    setTimeElapsed(0);

    // AbortController를 사용한 타임아웃 설정 (1800초 = 30분)
    const controller = new AbortController();
    setAbortController(controller);

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 1800000); // 1800초 (30분)

    // 경과 시간 추적
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    try {
      console.log('🚀 프로젝트 주제 생성 요청 시작 (비동기 폴링)...');
      
      const response = await n8nPollingClient.requestTopics(
        {
          sentence: selectedCareerSentence,
        },
        controller.signal
      );

      // 타임아웃 및 인터벌 클리어
      clearTimeout(timeoutId);
      clearInterval(timeInterval);

      if (!response.success) {
        throw new Error(response.error || '주제 생성에 실패했습니다.');
      }

      const data = response.data;

      // 실제 N8N 응답 데이터를 localStorage에 저장 (디버깅용)
      try {
        const timestamp = new Date().toISOString();
        const n8nResponseLog = {
          timestamp,
          response: data,
          url: "https://songssam.demodev.io/webhook/request?path=topics",
          careerSentence: selectedCareerSentence,
        };
        localStorage.setItem(
          "n8n_response_log",
          JSON.stringify(n8nResponseLog)
        );
        console.log(
          "✅ N8N 응답이 localStorage에 저장되었습니다:",
          "n8n_response_log"
        );
      } catch (storageError) {
        console.error("❌ localStorage 저장 실패:", storageError);
      }

      // 성공 시 응답 데이터 콘솔 로그 출력
      console.log("=== N8N 웹훅 응답 데이터 상세 분석 ===");
      console.log("응답 타입:", typeof data);
      console.log("응답이 배열인가?", Array.isArray(data));
      console.log("전체 응답 데이터:", data);
      console.log("응답 데이터 키들:", Object.keys(data || {}));

      // 모든 가능한 구조 확인
      console.log(
        "data.학기별_프로젝트_가이드라인:",
        data?.학기별_프로젝트_가이드라인
      );
      console.log("data[0]:", data?.[0]);
      console.log("data.topics:", data?.topics);
      console.log("data.subject:", data?.subject);
      console.log("data.result:", data?.result);
      console.log("data.response:", data?.response);

      // 배열인 경우 내부 구조 확인
      if (Array.isArray(data) && data.length > 0) {
        console.log("배열 첫 번째 요소:", data[0]);
        console.log("배열 첫 번째 요소 키들:", Object.keys(data[0] || {}));
      }

      // 간소화된 N8N 응답 파싱 함수
      const parseN8NResponseSimplified = (
        responseData: any
      ): DetailedProjectInfo[] | null => {
        console.log("=== 간소화된 N8N 응답 파싱 시작 ===");
        console.log("입력 데이터:", responseData);

        // 실제 응답 구조 기반 파싱
        try {
          // 새로운 응답 구조 처리 (workflowType, data 등)
          if (responseData && responseData.workflowType === 'topics' && responseData.data) {
            console.log('✅ 새로운 N8N 응답 구조 감지');
            responseData = responseData.data;
          }
          
          // 1. 가장 일반적인 구조: 직접 배열 또는 객체
          if (Array.isArray(responseData)) {
            console.log("✅ 배열 구조 감지");

            // 5개 학기 데이터인지 확인
            if (responseData.length === 5) {
              return responseData.map((item, index) => ({
                주제명:
                  extractString(item, [
                    "프로젝트_주제명",
                    "주제",
                    "title",
                    "topic",
                  ]) || `${index + 1}학기 주제`,
                사전_조사:
                  extractString(item, [
                    "사전_조사",
                    "research",
                    "background",
                  ]) || "",
                핵심_활동:
                  extractString(item, [
                    "핵심_활동",
                    "activity",
                    "core_activity",
                  ]) || "",
                연관_교과목:
                  extractArray(item, [
                    "연관_교과목_및_개념",
                    "연관_교과목",
                    "subjects",
                    "related_subjects",
                  ]) || [],
                사용_도구:
                  extractArray(item, [
                    "배울_툴_프로그램",
                    "사용_도구",
                    "tools",
                    "programs",
                  ]) || [],
              }));
            }
          }

          // 2. 중첩된 객체 구조
          if (responseData && typeof responseData === "object") {
            console.log("✅ 객체 구조 감지");

            // 학기별 프로젝트 가이드라인 구조 찾기
            const guidanceData =
              responseData.학기별_프로젝트_가이드라인 ||
              responseData.result?.학기별_프로젝트_가이드라인 ||
              responseData.response?.학기별_프로젝트_가이드라인;

            if (guidanceData) {
              console.log("✅ 학기별 가이드라인 구조 발견");
              const semesterKeys = [
                "1학년 1학기",
                "1학년 2학기",
                "2학년 1학기",
                "2학년 2학기",
                "3학년 1학기",
              ];

              return semesterKeys
                .map((semester, index) => {
                  const semesterData = guidanceData[semester];
                  if (!semesterData) return null;

                  return {
                    주제명:
                      extractString(semesterData, [
                        "프로젝트_주제명",
                        "주제",
                        "title",
                      ]) || `${semester} 주제`,
                    사전_조사:
                      extractString(semesterData, [
                        "사전_조사",
                        "내용_가이드라인.사전_조사",
                        "내용_가이드라인",
                        "content.사전_조사",
                      ]) || "",
                    핵심_활동:
                      extractString(semesterData, [
                        "핵심_활동",
                        "내용_가이드라인.핵심_활동",
                        "내용_가이드라인",
                        "content.핵심_활동",
                      ]) || "",
                    연관_교과목:
                      extractArray(semesterData, [
                        "연관_교과목_및_개념",
                        "연관_교과목",
                        "subjects",
                        "related_subjects",
                      ]) || [],
                    사용_도구:
                      extractArray(semesterData, [
                        "배울_툴_프로그램",
                        "사용_도구",
                        "tools",
                        "programs",
                      ]) || [],
                  };
                })
                .filter(Boolean);
            }
          }

          console.log("❌ 알려진 구조와 일치하지 않음");
          return null;
        } catch (error) {
          console.error("파싱 중 오류:", error);
          return null;
        }
      };

      // 헬퍼 함수: 문자열 추출
      const extractString = (obj: any, keys: string[]): string | null => {
        for (const key of keys) {
          if (key.includes(".")) {
            const parts = key.split(".");
            let value = obj;
            for (const part of parts) {
              value = value?.[part];
            }
            if (typeof value === "string" && value.trim()) return value.trim();
          } else {
            const value = obj[key];
            if (typeof value === "string" && value.trim()) return value.trim();
            // 객체인 경우 중첩된 구조에서 문자열 찾기
            if (value && typeof value === "object") {
              const nestedString = extractString(value, [
                "사전_조사",
                "핵심_활동",
                "content",
                "description",
                "text",
              ]);
              if (nestedString) return nestedString;
            }
          }
        }
        return null;
      };

      // 헬퍼 함수: 배열 추출
      const extractArray = (obj: any, keys: string[]): string[] | null => {
        for (const key of keys) {
          const value = obj[key];
          if (Array.isArray(value)) return value;
        }
        return null;
      };

      // 최소 데이터 추출 함수 (마지막 폴백)
      const extractMinimumData = (
        responseData: any
      ): DetailedProjectInfo[] | null => {
        console.log("=== 최소 데이터 추출 시도 ===");

        try {
          const extracted: DetailedProjectInfo[] = [];
          const semesterLabels = [
            "1학년 1학기",
            "1학년 2학기",
            "2학년 1학기",
            "2학년 2학기",
            "3학년 1학기",
          ];

          // 어떤 형태든 문자열이나 객체에서 최소한의 주제명 추출
          const recursiveExtractTopics = (
            obj: any,
            depth: number = 0
          ): string[] => {
            if (depth > 3) return []; // 너무 깊이 들어가지 않도록

            const topics: string[] = [];

            if (typeof obj === "string" && obj.length > 10) {
              topics.push(obj);
            } else if (Array.isArray(obj)) {
              obj.forEach((item) => {
                topics.push(...recursiveExtractTopics(item, depth + 1));
              });
            } else if (obj && typeof obj === "object") {
              Object.values(obj).forEach((value) => {
                topics.push(...recursiveExtractTopics(value, depth + 1));
              });
            }

            return topics;
          };

          const foundTopics = recursiveExtractTopics(responseData);
          console.log("추출된 주제들:", foundTopics);

          // 최소한 5개의 주제 생성 (부족하면 기본 주제 추가)
          for (let i = 0; i < 5; i++) {
            extracted.push({
              주제명:
                foundTopics[i] ||
                `${semesterLabels[i]} 프로젝트 (N8N 응답에서 추출)`,
              사전_조사: "",
              핵심_활동: "",
              연관_교과목: [],
              사용_도구: [],
            });
          }

          return extracted.length > 0 ? extracted : null;
        } catch (error) {
          console.error("최소 데이터 추출 실패:", error);
          return null;
        }
      };

      // 새로운 간소화된 파싱 시도
      const detailedProjects = parseN8NResponseSimplified(data);

      if (detailedProjects && detailedProjects.length > 0) {
        console.log("✅ 간소화된 파싱 성공");
        console.log("최종 추출된 프로젝트 배열:", detailedProjects);
        if (onUpdateTopicsFromWebhook) {
          onUpdateTopicsFromWebhook(detailedProjects);
        }
      } else if (data && data.topics && Array.isArray(data.topics)) {
        // 기존 topics 배열 구조 대응 (간단한 문자열 배열을 DetailedProjectInfo로 변환)
        const simpleProjects: DetailedProjectInfo[] = data.topics.map(
          (topic: string) => ({
            주제명: topic,
            사전_조사: "",
            핵심_활동: "",
            연관_교과목: [],
            사용_도구: [],
          })
        );
        if (onUpdateTopicsFromWebhook) {
          onUpdateTopicsFromWebhook(simpleProjects);
        }
      } else if (data && data.subject && Array.isArray(data.subject)) {
        // 기존 subject 배열 구조 대응
        const simpleProjects: DetailedProjectInfo[] = data.subject.map(
          (topic: string) => ({
            주제명: topic,
            사전_조사: "",
            핵심_활동: "",
            연관_교과목: [],
            사용_도구: [],
          })
        );
        if (onUpdateTopicsFromWebhook) {
          onUpdateTopicsFromWebhook(simpleProjects);
        }
      } else {
        // 응답 데이터 구조가 예상과 다른 경우 - 더 강력한 처리
        console.error("=== N8N 응답 구조 불일치 - 상세 분석 ===");
        console.error("예상과 다른 응답 구조입니다. 원본 데이터:", data);
        console.error("데이터 타입:", typeof data);
        console.error("JSON 문자열화:", JSON.stringify(data, null, 2));

        // 최후 수단: 응답에서 문자열 형태의 주제를 찾아내기
        let fallbackTopics: string[] = [];

        try {
          // 응답에서 '주제'나 'topic' 키워드가 포함된 값들 찾기
          const searchForTopics = (obj: any, path: string = ""): string[] => {
            const found: string[] = [];

            if (
              typeof obj === "string" &&
              obj.length > 10 &&
              obj.includes("프로젝트")
            ) {
              found.push(obj);
            } else if (Array.isArray(obj)) {
              obj.forEach((item, index) => {
                found.push(...searchForTopics(item, `${path}[${index}]`));
              });
            } else if (obj && typeof obj === "object") {
              Object.keys(obj).forEach((key) => {
                if (
                  (key.includes("주제") ||
                    key.includes("topic") ||
                    key.includes("title")) &&
                  typeof obj[key] === "string"
                ) {
                  found.push(obj[key]);
                }
                found.push(...searchForTopics(obj[key], `${path}.${key}`));
              });
            }

            return found;
          };

          fallbackTopics = searchForTopics(data);
          console.log("자동 감지된 주제들:", fallbackTopics);

          if (fallbackTopics.length > 0) {
            const fallbackProjects: DetailedProjectInfo[] = fallbackTopics
              .slice(0, 5)
              .map((topic, index) => ({
                주제명: topic,
                사전_조사: "",
                핵심_활동: "",
                연관_교과목: [],
                사용_도구: [],
              }));

            console.log("🔄 폴백 데이터로 처리:", fallbackProjects);
            onUpdateTopicsFromWebhook &&
              onUpdateTopicsFromWebhook(fallbackProjects);
            return; // 성공적으로 처리했으므로 목업 데이터 사용하지 않음
          }
        } catch (error) {
          console.error("폴백 처리 중 오류:", error);
        }

        // 마지막 시도: 최소한의 데이터라도 추출
        const minimumProjects = extractMinimumData(data);
        if (minimumProjects && minimumProjects.length > 0) {
          console.log("✅ 최소 데이터 추출 성공:", minimumProjects);
          if (onUpdateTopicsFromWebhook) {
            onUpdateTopicsFromWebhook(minimumProjects);
          }
        } else {
          // 정말 아무것도 찾을 수 없는 경우에만 목업 데이터 사용
          console.warn("⚠️ 목업 데이터 사용");
          setRegenerateError(
            "N8N에서 예상과 다른 형태의 데이터를 받았습니다. 임시 데이터를 표시합니다."
          );
          onRegenerateAllTopics();
        }
      }
    } catch (error) {
      // 타임아웃 및 인터벌 클리어
      clearTimeout(timeoutId);
      clearInterval(timeInterval);

      console.error("주제 생성 중 오류가 발생했습니다:", error);

      // 타임아웃 에러와 일반 네트워크 에러 구분
      if (error instanceof Error && error.name === "AbortError") {
        setRegenerateError(
          "주제 생성에 예상보다 오랜 시간이 걸리고 있습니다. 잠시 후 다시 시도해주세요. (생성은 보통 10-20분 정도 소요됩니다)"
        );
      } else if (
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        setRegenerateError(
          "네트워크 연결에 실패했습니다. 인터넷 연결을 확인하고 다시 시도해주세요."
        );
      } else {
        setRegenerateError(
          "주제 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setIsRegenerating(false);
      setAbortController(null);
      setTimeElapsed(0);
    }
  };

  // 생성된 주제가 있는지 확인
  const hasGeneratedTopics = () => {
    return group.topicRows.some((row: any) => row.selectedTopic);
  };

  // 시간을 분:초 형태로 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 로딩 메시지 생성
  const getLoadingMessage = () => {
    if (timeElapsed < 60) {
      return "맞춤형 프로젝트 주제를 생성 중입니다...";
    } else if (timeElapsed < 300) {
      return `고품질 주제를 생성 중입니다... (${formatTime(
        timeElapsed
      )} 경과)`;
    } else if (timeElapsed < 600) {
      return `심도있는 분석을 진행 중입니다... (${formatTime(
        timeElapsed
      )} 경과)`;
    } else if (timeElapsed < 1200) {
      return `상세한 가이드라인을 작성 중입니다... (${formatTime(
        timeElapsed
      )} 경과)`;
    } else {
      return `최적의 주제를 완성하고 있습니다... (${formatTime(
        timeElapsed
      )} 경과)`;
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setRegenerateError("사용자가 주제 생성을 취소했습니다.");
    }
  };

  // 개발자용: localStorage에 저장된 N8N 응답 확인
  const inspectN8NResponse = () => {
    try {
      const storedLog = localStorage.getItem("n8n_response_log");
      if (storedLog) {
        const log = JSON.parse(storedLog);
        console.log("=== 저장된 N8N 응답 분석 ===");
        console.log("저장 시간:", log.timestamp);
        console.log("진로 문장:", log.careerSentence);
        console.log("원본 응답:", log.response);

        // 응답 구조 자동 분석
        const response = log.response;
        console.log("\n=== 구조 분석 ===");
        console.log("타입:", typeof response);
        console.log("배열 여부:", Array.isArray(response));

        if (typeof response === "object" && response !== null) {
          console.log("키 목록:", Object.keys(response));

          // 학기별 구조 찾기
          const possibleSemesterKeys = [
            "1학년 1학기",
            "1학년 2학기",
            "2학년 1학기",
            "2학년 2학기",
            "3학년 1학기",
          ];
          const foundSemesterData = possibleSemesterKeys.find(
            (key) => response[key] || response.학기별_프로젝트_가이드라인?.[key]
          );

          if (foundSemesterData) {
            console.log("✅ 학기별 데이터 구조 발견:", foundSemesterData);
          }
        }

        return log;
      } else {
        console.log("저장된 N8N 응답이 없습니다.");
        return null;
      }
    } catch (error) {
      console.error("N8N 응답 분석 중 오류:", error);
      return null;
    }
  };

  // 개발 모드에서 글로벌 함수로 노출
  if (typeof window !== "undefined") {
    (window as any).inspectN8NResponse = inspectN8NResponse;
  }
  console.log("Current slide index:", currentSlideIndex);
  console.log("Current row:", group.topicRows[currentSlideIndex]);
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 진로 문장이 선택되었고 첫 번째 주제가 아직 생성되지 않았을 때 생성 버튼 표시 */}
      {selectedCareerSentence && !hasGeneratedTopics() && (
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={handleGenerateTopicsWithWebhook}
            disabled={isRegenerating}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isRegenerating
              ? getLoadingMessage()
              : "전체 학기 프로젝트 주제 생성"}
          </button>
          {isRegenerating && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm mb-2">최대 30분 소요 예상</p>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                취소
              </Button>
            </div>
          )}
          {regenerateError && (
            <p className="text-red-500 text-sm mt-2">{regenerateError}</p>
          )}
        </div>
      )}

      {/* 프로젝트 주제 재생성 버튼 - 주제가 생성된 후에 표시 */}
      {selectedCareerSentence && hasGeneratedTopics() && (
        <div className="flex flex-col items-center mb-6">
          <Button
            onClick={handleGenerateTopicsWithWebhook}
            disabled={isRegenerating}
            className="bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-3"
          >
            {isRegenerating ? getLoadingMessage() : "프로젝트 주제 재생성"}
          </Button>
          {isRegenerating && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm mb-2">최대 30분 소요 예상</p>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                취소
              </Button>
            </div>
          )}
          {regenerateError && (
            <p className="text-red-500 text-sm mt-2">{regenerateError}</p>
          )}
        </div>
      )}

      {/* 5개 학기 프로젝트를 하나씩 보이는 캐러셀로 표시 */}
      <Carousel className="w-full max-w-4xl mx-auto" setApi={setApi}>
        <CarouselContent>
          {group.topicRows.slice(0, 5).map((row: any, index: number) => (
            <CarouselItem key={row.id}>
              <div className="border rounded-lg p-6 bg-white shadow-sm h-full">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  {semesterLabels[index]}
                </h3>

                <div className="min-h-[400px] flex flex-col">
                  {/* 단계 1: 초기 상태 */}
                  {row.stage === "initial" && (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-lg">
                        진로 문장을 선택하고
                        <br />
                        주제 생성 버튼을 눌러주세요
                      </div>
                    </div>
                  )}

                  {/* 단계 2: 주제 생성 완료 */}
                  {row.stage === "topic_selected" && (
                    <div className="flex flex-col space-y-6">
                      {console.log(`=== 캐러셀 아이템 ${index} 렌더링 ===`)}
                      {console.log(`Row ${index} 상태:`, {
                        stage: row.stage,
                        selectedTopic: row.selectedTopic,
                        detailedProjectInfo: row.detailedProjectInfo,
                      })}

                      {/* 상세 프로젝트 카드 */}
                      <DetailedProjectCard
                        주제명={row.selectedTopic || ""}
                        사전_조사={row.detailedProjectInfo?.사전_조사}
                        핵심_활동={row.detailedProjectInfo?.핵심_활동}
                        연관_교과목={row.detailedProjectInfo?.연관_교과목}
                        사용_도구={row.detailedProjectInfo?.사용_도구}
                      />

                      {/* 주제 관리 버튼 */}
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => onLockTopic(row.id)}
                          variant="outline"
                          size="sm"
                        >
                          {row.isLocked ? "잠금 해제" : "주제 잠금"}
                        </Button>
                        <Button
                          onClick={async () => {
                            const topicName = row.selectedTopic || "";
                            try {
                              const response = await fetch(
                                "https://songssam.demodev.io/webhook/request?path=protocol",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    topicName: topicName,
                                    timestamp: new Date().toISOString(),
                                    source: "project-topic-carousel",
                                  }),
                                }
                              );

                              if (response.ok) {
                                try {
                                  const result = await response.json();
                                  console.log("N8N 응답:", result);

                                  // N8N 응답 데이터를 직접 전달 (원본 객체 그대로)
                                  let researchMethods = result;

                                  console.log(
                                    "파싱된 탐구 방법들:",
                                    researchMethods
                                  );

                                  if (
                                    Array.isArray(researchMethods) &&
                                    researchMethods.length > 0 &&
                                    onUpdateResearchMethods
                                  ) {
                                    onUpdateResearchMethods(
                                      row.id,
                                      researchMethods
                                    );
                                  } else if (
                                    researchMethods &&
                                    typeof researchMethods === "object" &&
                                    onUpdateResearchMethods
                                  ) {
                                    onUpdateResearchMethods(row.id, [
                                      researchMethods,
                                    ]);
                                  } else {
                                    onRegenerateMethods(row.id);
                                  }
                                } catch (parseError) {
                                  console.error(
                                    "N8N 응답 파싱 오류:",
                                    parseError
                                  );
                                  onRegenerateMethods(row.id);
                                }
                              } else {
                                console.error(
                                  "웹훅 호출 실패:",
                                  response.statusText
                                );
                                // Gateway Timeout이나 다른 서버 오류 처리
                                if (
                                  response.status === 504 ||
                                  response.statusText.includes(
                                    "Gateway Timeout"
                                  )
                                ) {
                                  console.log("Gateway Timeout 발생");
                                  // 에러 메시지만 표시하고 기본 생성은 하지 않음
                                }
                              }
                            } catch (error) {
                              console.error("웹훅 호출 중 오류:", error);
                              // 네트워크 오류 시 에러 메시지만 표시
                              console.log("네트워크 오류 발생");
                            }
                          }}
                          variant="outline"
                          size="sm"
                          disabled={row.isLoadingMethods || row.isLocked}
                        >
                          {row.isLoadingMethods
                            ? "생성 중..."
                            : row.researchMethods &&
                              row.researchMethods.length > 0
                            ? "탐구 방법 재생성"
                            : "탐구 방법 생성"}
                        </Button>
                      </div>

                      {/* 탐구 방법 섹션 */}
                      <div className="flex-1">
                        {row.researchMethods &&
                        row.researchMethods.length > 0 ? (
                          <ResearchMethodsCard
                            researchMethods={row.researchMethods}
                            isLoading={row.isLoadingMethods || false}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                              위의 '탐구 방법 생성' 버튼을 눌러 탐구 방법을
                              생성해주세요.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
export default ProjectTopicCarousel;
