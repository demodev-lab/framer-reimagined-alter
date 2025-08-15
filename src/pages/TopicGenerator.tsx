import React, { useState, useEffect, useRef } from "react";
import { useTopicManager } from "@/hooks/useTopicManager";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import PreparationMethodSection from "@/components/topic-generator/PreparationMethodSection";
import TopicGeneratorSection from "@/components/topic-generator/TopicGeneratorSection";
import YouTubePopup from "@/components/topic-generator/YouTubePopup";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import ResearchMethodsCard from "@/components/ResearchMethodsCard";
import { n8nPollingClient } from "@/utils/n8nPollingClient";

const TopicGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isDemo = searchParams.get('demo') === 'true';
  
  const {
    selectedCareerSentence,
    setSelectedCareerSentence,
    carouselGroups,
    ...topicManager
  } = useTopicManager();
  const [youtubePopup, setYoutubePopup] = useState({
    open: false,
    videoId: "",
    title: ""
  });
  const [demoStep, setDemoStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoCareer, setSelectedDemoCareer] = useState("의사");
  const [selectedDemoSubject, setSelectedDemoSubject] = useState("생명과학");
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [demoTopicStage, setDemoTopicStage] = useState<"initial" | "topics_generated" | "topic_selected" | "research_methods">("initial");
  const [generatedDemoTopics, setGeneratedDemoTopics] = useState<string[]>([]);
  const [selectedDemoTopic, setSelectedDemoTopic] = useState<string>("");
  const [generatedDemoResearchMethods, setGeneratedDemoResearchMethods] = useState<unknown[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleOpenYouTubePopup = (videoId: string, title: string) => {
    setYoutubePopup({
      open: true,
      videoId,
      title
    });
  };

  const handleCloseYouTubePopup = () => {
    setYoutubePopup({
      open: false,
      videoId: "",
      title: ""
    });
  };

  // 체험 모드 데이터 - 실제 N8N 생성 데이터 중심
  const getDemoDataBySelection = () => {
    const careerData = {
      "의사": {
        careerSentences: selectedDemoCareer === "의사" && generatedCareerSentences.length > 0 ? generatedCareerSentences : [
          "AI 기반 의료 영상 분석 기술로 조기 진단이 어려운 췌장암의 미세 병변 판독 오류로 인한 치료 시기 지연 문제를 해결하는 의사",
          "3D 바이오 프린팅 기반 인공 장기 재생 기술로 만성 장기 부전 환자의 장기 이식 대기 시간 장기화 및 면역 거부 반응으로 인한 생존율 저하 문제를 해결하는 의사",
          "증강 현실(AR) 기반 수술 내비게이션 시스템으로 복잡한 신경외과 수술 중 발생하는 중요 신경 및 혈관 손상 위험 증가 문제를 해결하는 의사"
        ],
        subjects: ["공통과학", "생명과학", "화학"]
      },
      "반도체 공학자": {
        careerSentences: selectedDemoCareer === "반도체 공학자" && generatedCareerSentences.length > 0 ? generatedCareerSentences : [
          "머신 비전 기반 딥러닝 이미지 분석 및 공정 피드백 시스템 개발로 반도체 웨이퍼 표면의 미세 이물질 및 패턴 결함으로 인한 수율 저하를 해결하는 반도체 연구원",
          "압전 센서 기반 실시간 진동 모니터링 및 능동 제어 시스템 개발로 반도체 리소그래피 공정 중 발생하는 외부 미세 진동으로 인한 패턴 정밀도 저하를 해결하는 반도체 연구원",
          "열전도성 복합 소재 기반 3D 프린팅 방열 구조 설계 및 열 유동 시뮬레이션 기술로 소형 전자기기 및 IoT 디바이스 내 반도체 칩의 전반적인 발열로 인한 성능 저하 및 작동 수명 단축을 해결하는 반도체 연구원"
        ],
        subjects: ["수학(상)", "물리1", "화학1"]
      }
    };

    const currentCareerData = careerData[selectedDemoCareer] || careerData["의사"];

    return {
      careers: ["의사", "반도체 공학자"],
      careerSentences: currentCareerData.careerSentences,
      subjects: currentCareerData.subjects,
      // 실제 N8N에서 생성된 주제만 사용 (데모 데이터 완전 제거)
      selectedTopic: generatedDemoTopic || "탐구 주제 생성 중..."
    };
  };

  const demoData = getDemoDataBySelection();

  // N8N을 통한 진로 문장 생성 함수
  const generateCareerSentenceWithN8N = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 N8N을 통한 진로 문장 생성 시작...', { selectedDemoCareer });
      
      // 이전 요청이 진행 중이면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();
      
      // 진로별 요청 데이터 준비
      const careerData = {
        careerField: selectedDemoCareer,
        request: `${selectedDemoCareer} 관련 진로 문장을 생성해주세요`,
        aspiration: null
      };
      
      console.log('📤 N8N으로 전송할 진로 데이터:', careerData);
      
      const response = await n8nPollingClient.requestCareerSentence(
        careerData,
        abortControllerRef.current.signal
      );
      
      console.log('✅ N8N 진로 문장 생성 완료:', response);
      
      if (response.success && response.data) {
        // N8N에서 받은 진로 문장을 파싱
        const careerSentence = response.data;
        console.log('🎯 생성된 진로 문장:', careerSentence);
        
        // 하나의 진로 문장을 받았지만, 데모용으로 3개로 확장
        const sentences = [
          careerSentence,
          // 데모용으로 약간 변형된 버전들 추가
          careerSentence.replace(/을/g, '를').replace(/를/g, '을'), // 조사 변경
          careerSentence.replace(/하는/g, '하여').replace(/하여/g, '하는') // 어미 변경
        ].filter(s => s.trim().length > 0);
        
        // 중복 제거
        const uniqueSentences = [...new Set(sentences)];
        
        // 최소 1개, 최대 3개 보장
        const finalSentences = uniqueSentences.slice(0, 3);
        if (finalSentences.length < 3) {
          // 부족하면 기본 문장들로 채우기
          const defaultSentences = getDefaultCareerSentences(selectedDemoCareer);
          while (finalSentences.length < 3 && defaultSentences.length > 0) {
            const defaultSentence = defaultSentences.shift();
            if (defaultSentence && !finalSentences.includes(defaultSentence)) {
              finalSentences.push(defaultSentence);
            }
          }
        }
        
        setGeneratedCareerSentences(finalSentences);
        setIsLoading(false);
        setDemoStep(1);
      } else {
        console.error('❌ N8N 진로 문장 생성 실패:', response.error);
        
        // 실패 시 기본 문장들 사용
        const defaultSentences = getDefaultCareerSentences(selectedDemoCareer);
        setGeneratedCareerSentences(defaultSentences);
        setIsLoading(false);
        setDemoStep(1);
      }
    } catch (error) {
      console.error('💥 진로 문장 생성 중 오류:', error);
      
      // 오류 시 기본 문장들 사용
      const defaultSentences = getDefaultCareerSentences(selectedDemoCareer);
      setGeneratedCareerSentences(defaultSentences);
      setIsLoading(false);
      setDemoStep(1);
    }
  };

  // 기본 진로 문장들 (N8N 실패 시 대체용)
  const getDefaultCareerSentences = (career: string): string[] => {
    const defaultData = {
      "의사": [
        "AI 기반 의료 영상 분석 기술로 조기 진단이 어려운 췌장암의 미세 병변 판독 오류로 인한 치료 시기 지연 문제를 해결하는 의사",
        "3D 바이오 프린팅 기반 인공 장기 재생 기술로 만성 장기 부전 환자의 장기 이식 대기 시간 장기화 및 면역 거부 반응으로 인한 생존율 저하 문제를 해결하는 의사",
        "증강 현실(AR) 기반 수술 내비게이션 시스템으로 복잡한 신경외과 수술 중 발생하는 중요 신경 및 혈관 손상 위험 증가 문제를 해결하는 의사"
      ],
      "반도체 공학자": [
        "머신 비전 기반 딥러닝 이미지 분석 및 공정 피드백 시스템 개발로 반도체 웨이퍼 표면의 미세 이물질 및 패턴 결함으로 인한 수율 저하를 해결하는 반도체 연구원",
        "압전 센서 기반 실시간 진동 모니터링 및 능동 제어 시스템 개발로 반도체 리소그래피 공정 중 발생하는 외부 미세 진동으로 인한 패턴 정밀도 저하를 해결하는 반도체 연구원",
        "열전도성 복합 소재 기반 3D 프린팅 방열 구조 설계 및 열 유동 시뮬레이션 기술로 소형 전자기기 및 IoT 디바이스 내 반도체 칩의 전반적인 발열로 인한 성능 저하 및 작동 수명 단축을 해결하는 반도체 연구원"
      ]
    };
    
    return defaultData[career] || defaultData["의사"];
  };

  // N8N을 통한 탐구 주제 생성 함수
  const generateTopicWithN8N = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 N8N을 통한 탐구 주제 생성 시작...', { 
        selectedCareerSentence, 
        selectedDemoSubject 
      });
      
      // 이전 요청이 진행 중이면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();
      
      // 탐구 주제 생성을 위한 데이터 준비
      const topicData = {
        sentence: selectedCareerSentence || demoData.careerSentences[0],
        진로문장: selectedCareerSentence || demoData.careerSentences[0],
        교과과목: selectedDemoSubject,
        교과개념: "", // 체험 모드에서는 빈 값
        주제유형: "보고서 주제",
        후속탐구: ""
      };
      
      console.log('📤 N8N으로 전송할 탐구 주제 데이터:', topicData);
      
      const response = await n8nPollingClient.requestTopics(
        topicData,
        abortControllerRef.current.signal
      );
      
      console.log('✅ N8N 탐구 주제 생성 완료:', response);
      
      if (response.success && response.data) {
        // N8N에서 받은 탐구 주제를 파싱
        const parseN8NTopicResponse = (responseData) => {
          try {
            console.log('🔍 탐구 주제 파싱 시작 - 데이터 타입:', typeof responseData);
            console.log('🔍 전체 응답 구조:', responseData);
            
            let topicsData = responseData;
            
            // 새로운 응답 구조 처리 (workflowType, data 등)
            if (topicsData && topicsData.workflowType === 'topics' && topicsData.data) {
              console.log('🔍 새로운 N8N 응답 구조 감지');
              topicsData = topicsData.data;
            }
            
            // 단일 주제 객체인 경우 (새로운 구조)
            if (topicsData && typeof topicsData === 'object' && topicsData['주제명']) {
              console.log('🔍 단일 주제 객체 감지');
              return topicsData['주제명'] || '탐구 주제';
            }
            
            // 배열 형태의 주제 데이터 처리 (기존 방식)
            if (Array.isArray(topicsData) && topicsData.length > 0) {
              console.log('🔍 배열 길이:', topicsData.length);
              const firstTopic = topicsData[0];
              return firstTopic['주제명'] || firstTopic.title || '탐구 주제';
            }
            
            console.log('⚠️ 예상치 못한 데이터 구조:', responseData);
            return '맞춤형 탐구 주제';
          } catch (error) {
            console.error('❌ 탐구 주제 데이터 파싱 오류:', error);
            return '탐구 주제 생성 오류';
          }
        };
        
        // N8N에서 받은 탐구 주제를 파싱 (복수개 주제)
        const parseN8NTopicsResponse = (responseData) => {
          try {
            console.log('🔍 탐구 주제들 파싱 시작 - 데이터 타입:', typeof responseData);
            console.log('🔍 전체 응답 구조:', responseData);
            
            let topicsData = responseData;
            
            // 새로운 응답 구조 처리 (workflowType, data 등)
            if (topicsData && topicsData.workflowType === 'topics' && topicsData.data) {
              console.log('🔍 새로운 N8N 응답 구조 감지');
              topicsData = topicsData.data;
            }
            
            // data 필드가 있는 경우 한 단계 더 들어가기
            if (topicsData && topicsData.data && !Array.isArray(topicsData)) {
              topicsData = topicsData.data;
            }
            
            // 배열 형태의 주제 데이터 처리
            if (Array.isArray(topicsData) && topicsData.length > 0) {
              console.log('🔍 배열 길이:', topicsData.length);
              const topics = topicsData.map((topic, index) => {
                if (typeof topic === 'string') return topic;
                return topic['주제명'] || topic.title || topic['탐구주제'] || `탐구 주제 ${index + 1}`;
              });
              console.log('🎯 파싱된 주제들:', topics);
              return topics;
            }
            
            // 단일 주제 객체인 경우 배열로 변환
            if (topicsData && typeof topicsData === 'object' && (topicsData['주제명'] || topicsData['탐구주제'])) {
              console.log('🔍 단일 주제 객체 감지');
              const topic = topicsData['주제명'] || topicsData['탐구주제'] || '탐구 주제';
              return [topic];
            }
            
            // 문자열인 경우 그대로 배열로 변환
            if (typeof topicsData === 'string') {
              return [topicsData];
            }
            
            console.log('⚠️ 예상치 못한 데이터 구조:', responseData);
            return ['맞춤형 탐구 주제'];
          } catch (error) {
            console.error('❌ 탐구 주제 데이터 파싱 오류:', error);
            return ['탐구 주제 생성 오류'];
          }
        };
        
        const generatedTopics = parseN8NTopicsResponse(response.data);
        console.log('🎯 생성된 탐구 주제들:', generatedTopics);
        
        setGeneratedDemoTopics(generatedTopics);
        setDemoTopicStage("topics_generated");
        setIsLoading(false);
      } else {
        console.error('❌ N8N 탐구 주제 생성 실패:', response.error);
        
        // 실패 시 기본 주제들 사용
        const defaultTopics = getDefaultTopicsForSubject(selectedDemoSubject, selectedDemoCareer);
        setGeneratedDemoTopics(defaultTopics);
        setDemoTopicStage("topics_generated");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 탐구 주제 생성 중 오류:', error);
      
      // 오류 시 기본 주제들 사용
      const defaultTopics = getDefaultTopicsForSubject(selectedDemoSubject, selectedDemoCareer);
      setGeneratedDemoTopics(defaultTopics);
      setDemoTopicStage("topics_generated");
      setIsLoading(false);
    }
  };

  // 기본 탐구 주제들 (N8N 실패 시 대체용)
  const getDefaultTopicsForSubject = (subject: string, career: string): string[] => {
    const defaultTopics = {
      "의사": {
        "공통과학": [
          "미세먼지가 인체에 미치는 영향과 대응방안 연구",
          "기후변화와 감염병 발생의 상관관계 분석",
          "환경호르몬이 내분비계에 미치는 영향 탐구"
        ],
        "생명과학": [
          "항생제 내성균 증가 원인과 해결방안 탐구",
          "유전자 치료의 현재와 미래 전망 연구",
          "면역체계 강화를 위한 프로바이오틱스 효과 분석"
        ],
        "화학": [
          "신약 개발 과정에서 화학의 역할 탐구",
          "천연물질을 이용한 항염 성분 분석",
          "나노기술을 활용한 약물 전달 시스템 연구"
        ]
      },
      "반도체 공학자": {
        "수학(상)": [
          "반도체 회로 설계에 활용되는 수학적 모델링 연구",
          "AI 칩 최적화를 위한 알고리즘 수학 원리 탐구",
          "반도체 공정에서 확률과 통계의 활용 분석"
        ],
        "물리1": [
          "반도체 소자의 전자 이동 원리와 효율성 연구",
          "양자역학이 차세대 반도체에 미치는 영향 탐구",
          "반도체 발열 문제 해결을 위한 열역학 적용"
        ],
        "화학1": [
          "반도체 제조 공정에서 화학 반응의 역할 분석",
          "친환경 반도체 소재 개발을 위한 화학적 접근",
          "반도체 식각 공정에 사용되는 화학 물질 연구"
        ]
      }
    };
    
    return defaultTopics[career]?.[subject] || ["맞춤형 탐구 주제"];
  };

  // N8N을 통한 탐구 방법 생성 함수
  const generateResearchMethodWithN8N = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 N8N을 통한 탐구 방법 생성 시작...', { 
        generatedDemoTopic 
      });
      
      // 이전 요청이 진행 중이면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();
      
      // 탐구 방법 생성을 위한 데이터 준비
      const researchData = {
        topicName: selectedDemoTopic || "탐구 주제",
        timestamp: new Date().toISOString(),
        source: "demo_mode",
        detailLevel: "고등학생 수준"
      };
      
      console.log('📤 N8N으로 전송할 탐구 방법 데이터:', researchData);
      
      const response = await n8nPollingClient.requestResearchMethods(
        researchData,
        abortControllerRef.current.signal
      );
      
      console.log('✅ N8N 탐구 방법 생성 완료:', response);
      
      if (response.success && response.data) {
        console.log('🎯 생성된 탐구 방법:', response.data);
        setGeneratedDemoResearchMethods([response.data]);
        setDemoTopicStage("research_methods");
        setIsLoading(false);
      } else {
        console.error('❌ N8N 탐구 방법 생성 실패:', response.error);
        
        // 실패 시 기본 탐구 방법 사용
        const defaultMethod = getDefaultResearchMethod(selectedDemoTopic);
        setGeneratedDemoResearchMethods([defaultMethod]);
        setDemoTopicStage("research_methods");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 탐구 방법 생성 중 오류:', error);
      
      // 오류 시 기본 탐구 방법 사용
      const defaultMethod = getDefaultResearchMethod(selectedDemoTopic);
      setGeneratedDemoResearchMethods([defaultMethod]);
      setDemoTopicStage("research_methods");
      setIsLoading(false);
    }
  };

  // 기본 탐구 방법 (N8N 실패 시 대체용)
  const getDefaultResearchMethod = (topic: string) => {
    return {
      "탐구 주제": topic,
      "탐구 목표": {
        "주요 목표": `${topic}에 대한 체계적인 연구를 통해 실용적인 해결방안을 제시한다.`,
        "세부 목표": [
          "관련 자료를 조사하고 현재 상황을 파악한다",
          "문제점을 분석하고 원인을 찾아낸다", 
          "실험이나 조사를 통해 데이터를 수집한다",
          "결과를 분석하여 실용적인 해결방안을 제시한다"
        ]
      },
      "탐구 가설": "체계적인 연구 방법을 통해 해당 주제에 대한 새로운 해결방안을 찾을 수 있을 것이다.",
      "필요한 준비물": [
        {
          "항목": "노트북 또는 태블릿",
          "사용목적": "자료 조사 및 데이터 정리",
          "설명": "인터넷 검색과 문서 작성을 위한 디지털 기기",
          "대체준비물": "스마트폰 + 노트"
        },
        {
          "항목": "조사 설문지 또는 실험 도구",
          "사용목적": "1차 데이터 수집",
          "설명": "주제에 맞는 조사나 간단한 실험을 위한 도구",
          "대체준비물": "온라인 설문 도구 (구글 폼 등)"
        }
      ],
      "단계별 프로토콜": {
        "1단계: 자료 조사": [
          {
            "단계": "주제 관련 기본 정보 수집",
            "상세설명": "인터넷, 도서관, 뉴스 등을 통해 주제에 대한 기본 정보를 수집한다.",
            "입력내용": "신뢰할 만한 출처에서 최신 정보를 수집하고 정리한다"
          }
        ],
        "2단계: 실험/조사 설계": [
          {
            "단계": "연구 방법 계획",
            "상세설명": "주제에 맞는 적절한 연구 방법(설문, 실험, 관찰 등)을 선택한다.",
            "입력내용": "연구 대상, 방법, 기간 등을 구체적으로 계획"
          }
        ]
      },
      "주의사항": {
        "실험과정에서의주의사항": [
          "조사나 실험 시 개인정보 보호에 주의한다",
          "신뢰할 수 있는 출처의 정보만 활용한다"
        ],
        "예상문제와해결책": [
          {
            "문제": "정보 수집이 어려운 경우",
            "해결책": "온라인 자료, 도서관, 전문기관 등 다양한 경로를 활용한다"
          }
        ]
      },
      "참고자료": [
        {
          "제목": "고등학생을 위한 연구 방법론 가이드",
          "설명": "고등학생이 따라하기 쉬운 연구 방법을 단계별로 설명한 가이드",
          "링크": "https://www.kofac.re.kr/"
        }
      ]
    };
  };

  // 로딩 시뮬레이션 함수 - 일반적인 단계 이동용
  const simulateLoading = (nextStep: number) => {
    setIsLoading(true);
    const randomTime = Math.random() * 1000 + 800; // 0.8~1.8초 랜덤
    setTimeout(() => {
      setIsLoading(false);
      setDemoStep(nextStep);
    }, randomTime);
  };

  // 진행률 계산 - 실제 서비스 플로우 4단계
  const totalSteps = 4;
  const currentStep = demoStep + 1;
  

  // 체험 모드일 때 진로 변경 시 상태 초기화
  useEffect(() => {
    if (isDemo) {
      // 진로가 변경되면 모든 생성된 데이터 초기화
      setGeneratedCareerSentences([]);
      setDemoTopicStage("initial");
      setGeneratedDemoTopics([]);
      setSelectedDemoTopic("");
      setGeneratedDemoResearchMethods([]);
      // 2단계 이상에 있었다면 1단계로 돌아가기
      if (demoStep > 0) {
        setDemoStep(0);
      }
    }
  }, [selectedDemoCareer]);

  // 체험 모드일 때 진로 문장 설정
  useEffect(() => {
    if (isDemo && demoStep >= 2 && selectedCareerSentence !== demoData.careerSentences[0]) {
      setSelectedCareerSentence(demoData.careerSentences[0]);
    }
  }, [isDemo, demoStep, selectedDemoCareer]);

  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-0">
        {/* 체험 모드 배너 및 진행률 */}
        {isDemo && (
          <div className="mt-4 space-y-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">빠른 체험 모드</span>
              </div>
              <div className="text-sm">
                {currentStep}/{totalSteps} 단계
              </div>
            </div>
            
            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <section className="text-center py-10 md:py-0">
          {/* Logo and Title Section */}
          
        </section>

        {!isDemo && <PreparationMethodSection />}

        <div className="max-w-3xl mx-auto my-6">
          
        </div>

        <section id="topic-generator-section" className="scroll-mt-[150px] pb-96">
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">탐구 주제 생성</h2>
            <p className="max-w-xl mx-auto text-base text-muted-foreground">최신 논문 연구, 진로 문장, 교과 개념을 바탕으로 심화 탐구 주제를 생성합니다.</p>
            
            {/* YouTube 버튼들 - 중앙 정렬 및 동일한 너비 적용 */}
            {!isDemo && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button onClick={() => handleOpenYouTubePopup("z4HfvrPA_kI", "어떻게 사용하나요?")} className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40">
                  어떻게 사용하나요?
                </Button>
                <Button onClick={() => handleOpenYouTubePopup("-Orv-jTXkSs", "학생부 준비 방법")} className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40">
                  학생부 준비 방법
                </Button>
              </div>
            )}
          </div>
          
          {isDemo ? (
            // 체험 모드 UI - 실제 서비스 플로우 4단계
            <div className="max-w-4xl mx-auto px-4">
              {/* 로딩 상태 */}
              {isLoading && (
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <h3 className="text-xl font-bold">
                      {demoStep === 0 && "진로 문장을 생성 중입니다..."}
                      {demoStep === 2 && demoTopicStage === "initial" && "탐구 주제를 생성 중입니다..."}
                      {demoTopicStage === "topic_selected" && "탐구 방법을 생성 중입니다..."}
                      {(demoStep === 1 || (demoStep === 2 && demoTopicStage !== "initial") || demoTopicStage === "topics_generated") && "AI가 생성 중입니다..."}
                    </h3>
                    <p className="text-gray-600">
                      {demoStep === 0 && "N8N AI가 맞춤형 진로 문장을 만들고 있어요 🎯"}
                      {demoStep === 2 && demoTopicStage === "initial" && "선택한 진로와 과목에 맞는 탐구 주제를 만들고 있어요 📚"}
                      {demoTopicStage === "topic_selected" && "탐구 주제에 맞는 구체적인 연구 방법을 만들고 있어요 🔬"}
                      {(demoStep === 1 || (demoStep === 2 && demoTopicStage !== "initial") || demoTopicStage === "topics_generated") && "잠시만 기다려주세요 ⏱️"}
                    </p>
                  </div>
                </Card>
              )}

              {/* 1단계: 직업 선택 */}
              {!isLoading && demoStep === 0 && (
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">🎯 희망 직업 선택</h3>
                      <p className="text-gray-600">어떤 직업을 꿈꾸고 계신가요?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {demoData.careers.map((career, index) => (
                        <div 
                          key={index}
                          onClick={() => setSelectedDemoCareer(career)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            career === selectedDemoCareer 
                              ? 'border-purple-500 bg-purple-100' 
                              : 'border-gray-300 bg-white hover:border-purple-300'
                          }`}
                        >
                          <span className="font-medium">{career}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={generateCareerSentenceWithN8N}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    >
                      💭 진로 문장 생성하기
                    </Button>
                  </div>
                </Card>
              )}

              {/* 2단계: 진로 문장 생성 및 선택 */}
              {!isLoading && demoStep === 1 && (
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">✨ 진로 문장 선택</h3>
                      <p className="text-gray-600">AI가 {selectedDemoCareer} 직업에 맞는 진로 문장을 생성했어요</p>
                    </div>
                    
                    <div className="space-y-4">
                      {demoData.careerSentences.map((sentence, index) => (
                        <div 
                          key={index}
                          onClick={() => setSelectedCareerSentence(sentence)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            sentence === selectedCareerSentence || (selectedCareerSentence === "" && index === 0)
                              ? 'border-purple-500 bg-purple-100' 
                              : 'border-gray-300 bg-white hover:border-purple-300'
                          }`}
                        >
                          <p className="font-medium text-sm leading-relaxed break-words">{sentence}</p>
                          {index === 0 && selectedCareerSentence === "" && (
                            <p className="text-sm text-purple-600 mt-2">✨ 추천</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => {
                        if (!selectedCareerSentence) {
                          setSelectedCareerSentence(demoData.careerSentences[0]);
                        }
                        simulateLoading(2);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    >
                      📚 과목 선택하기
                    </Button>
                  </div>
                </Card>
              )}

              {/* 3단계: 과목 선택 후 탐구 주제 생성 (초기 상태) */}
              {!isLoading && demoStep === 2 && demoTopicStage === "initial" && (
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">📖 과목 선택</h3>
                      <p className="text-gray-600">어떤 과목으로 탐구하고 싶으신가요?</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">선택된 진로</p>
                      <p className="font-medium text-sm leading-relaxed break-words">{selectedCareerSentence || demoData.careerSentences[0]}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-3">관련 과목</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {demoData.subjects.map((subject, index) => (
                          <div 
                            key={index}
                            onClick={() => setSelectedDemoSubject(subject)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              subject === selectedDemoSubject 
                                ? 'border-purple-500 bg-purple-100' 
                                : 'border-gray-300 bg-white hover:border-purple-300'
                            }`}
                          >
                            <span className="font-medium text-sm">{subject}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={generateTopicWithN8N}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    >
                      🚀 탐구 주제 생성하기
                    </Button>
                  </div>
                </Card>
              )}

              {/* 탐구 주제 생성 완료 - 주제 목록 표시 (실제 TopicResultsCard 방식) */}
              {!isLoading && demoStep === 2 && demoTopicStage === "topics_generated" && (
                <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">🎯 생성된 탐구 주제</h3>
                      <p className="text-gray-600">AI가 생성한 탐구 주제 중 하나를 선택해주세요</p>
                    </div>

                    <div className="space-y-3">
                      {generatedDemoTopics.map((topic, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedDemoTopic(topic);
                            setDemoTopicStage("topic_selected");
                          }}
                          className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                                {topic}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {selectedDemoSubject}
                                </span>
                                <span>•</span>
                                <span>AI 생성</span>
                              </div>
                            </div>
                            <div className="flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-sm font-medium">선택하기</span>
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-4">
                      <Button 
                        onClick={() => setDemoTopicStage("initial")}
                        variant="outline"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ← 다시 생성하기
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* 주제 선택 완료 - 탐구 방법 생성 (실제 SelectedTopicCard 방식) */}
              {!isLoading && demoStep === 2 && demoTopicStage === "topic_selected" && (
                <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">✅ 탐구 주제 선택 완료</h3>
                      <p className="text-gray-600">선택한 주제에 맞는 탐구 방법을 생성하겠습니다</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800 mb-2">선택된 탐구 주제</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedDemoTopic}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              {selectedDemoSubject}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              체험모드
                            </span>
                          </div>
                        </div>
                        <div className="text-green-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setDemoTopicStage("topics_generated")}
                        variant="outline"
                        className="flex-1"
                      >
                        ← 주제 다시 선택
                      </Button>
                      <Button 
                        onClick={generateResearchMethodWithN8N}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        📋 탐구 방법 생성하기
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* 탐구 방법 완성 & 회원가입 유도 */}
              {!isLoading && demoTopicStage === "research_methods" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">🎉 탐구 방법 완성!</h3>
                    <p className="text-gray-600">고등학생도 쉽게 따라할 수 있는 실용적인 방법이에요</p>
                  </div>
                  
                  {/* 실제 N8N에서 생성된 탐구 방법 사용 */}
                  <ResearchMethodsCard 
                    researchMethods={generatedDemoResearchMethods}
                    isLoading={false}
                  />
                  
                  <Card className="p-6 bg-gradient-to-r from-green-100 to-green-50 border-green-200">
                    <div className="text-center space-y-4">
                      <h4 className="text-2xl font-bold text-green-800">체험 완료! 🎉</h4>
                      <p className="text-lg text-green-700">실제 서비스는 더욱 놀라워요!</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-2">
                          <p className="text-sm text-green-600">🎯 <strong>10배 더 정교한 AI</strong></p>
                          <p className="text-xs text-gray-600">3만편 논문 분석 데이터</p>
                          <p className="text-sm text-green-600">📚 <strong>무제한 주제 생성</strong></p>
                          <p className="text-xs text-gray-600">매월 100개까지 가능</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-green-600">💾 <strong>보관함 & 관리</strong></p>
                          <p className="text-xs text-gray-600">진행상황 체크 기능</p>
                          <p className="text-sm text-green-600">🏆 <strong>대학별 맞춤 분석</strong></p>
                          <p className="text-xs text-gray-600">입시 전문가 검증</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate('/login')}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg shadow-lg w-full"
                      >
                        무료 회원가입하고 10배 더 정교한 주제 받기 🚀
                      </Button>
                      <p className="text-xs text-gray-500">회원가입은 무료이며, 첫 달 무료 체험도 가능해요!</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <TopicGeneratorSection {...topicManager} carouselGroups={carouselGroups} selectedCareerSentence={selectedCareerSentence} setSelectedCareerSentence={setSelectedCareerSentence} />
          )}
        </section>
      </main>

      <YouTubePopup open={youtubePopup.open} onOpenChange={open => !open && handleCloseYouTubePopup()} videoId={youtubePopup.videoId} title={youtubePopup.title} />
    </div>;
};

export default TopicGenerator;
