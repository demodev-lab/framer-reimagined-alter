export interface N8NPollingOptions {
  endpoint: string;
  data: Record<string, unknown>;
  signal?: AbortSignal;
  pollingInterval?: number; // 기본 2초
  maxPollingTime?: number; // 기본 5분
}

export interface N8NJobResponse {
  jobId: string;
  status?: "pending" | "processing" | "completed" | "failed";
  message?: string;
}

export interface N8NJobStatusResponse {
  status: "pending" | "processing" | "completed" | "failed";
  result?: unknown;
  error?: string;
  progress?: number;
}

export interface N8NPollingResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  jobId?: string;
  status?: string;
}

export class N8NPollingClient {
  private baseURL = import.meta.env.DEV ? "" : "https://songssam.demodev.io";
  private defaultPollingInterval = 2000; // 2초
  private defaultMaxPollingTime = 300000; // 5분

  async requestWithPolling<T = unknown>(
    options: N8NPollingOptions
  ): Promise<N8NPollingResponse<T>> {
    const {
      endpoint,
      data,
      signal,
      pollingInterval = this.defaultPollingInterval,
      maxPollingTime = this.defaultMaxPollingTime,
    } = options;

    try {
      // 1단계: 초기 요청을 보내고 jobId 받기
      console.log(`🚀 N8N 비동기 요청 시작: ${endpoint}`);

      const jobResponse = await this.initiateJob(endpoint, data, signal);

      if (!jobResponse.success || !jobResponse.jobId) {
        return {
          success: false,
          error: jobResponse.error || "Job ID를 받지 못했습니다.",
        };
      }

      const jobId = jobResponse.jobId;
      console.log(`📋 Job ID 수신: ${jobId}`);

      // 2단계: 폴링으로 상태 확인
      const result = await this.pollJobStatus<T>(
        endpoint,
        jobId,
        signal,
        pollingInterval,
        maxPollingTime
      );

      return result;
    } catch (error) {
      console.error(`❌ N8N 폴링 요청 실패: ${endpoint}`, error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  private async initiateJob(
    endpoint: string,
    data: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      const url = `${this.baseURL}/webhook/request?path=${endpoint}`;
      console.log(`📍 요청 URL: ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify(data),
        signal,
        keepalive: true,
        mode: "cors",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // jobId가 직접 반환되거나 객체 내부에 있을 수 있음
      const jobId = result.jobId || result.job_id || result.id || result;

      if (typeof jobId === "string") {
        return { success: true, jobId };
      } else {
        console.error("예상치 못한 응답 형식:", result);
        return { success: false, error: "Job ID 형식이 올바르지 않습니다." };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "요청 초기화 실패",
      };
    }
  }

  private async pollJobStatus<T>(
    endpoint: string,
    jobId: string,
    signal?: AbortSignal,
    pollingInterval: number = this.defaultPollingInterval,
    maxPollingTime: number = this.defaultMaxPollingTime
  ): Promise<N8NPollingResponse<T>> {
    const startTime = Date.now();
    let attemptCount = 0;

    while (Date.now() - startTime < maxPollingTime) {
      if (signal?.aborted) {
        return {
          success: false,
          error: "요청이 취소되었습니다.",
          jobId,
          status: "cancelled",
        };
      }

      attemptCount++;
      console.log(`🔄 상태 확인 중... (시도 ${attemptCount}회)`);

      try {
        const statusUrl = `${this.baseURL}/webhook/get-job-status-webhook/get/${jobId}`;

        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
          mode: "cors",
          credentials: "omit",
          signal,
        });

        if (!response.ok) {
          // 404는 아직 처리 중일 수 있음
          if (response.status === 404) {
            console.log("⏳ Job이 아직 처리 중입니다...");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const statusData = await response.json();
          console.log(`📊 Job 상태:`, statusData.status);

          if (statusData.status === "completed") {
            console.log("✅ Job 완료!");
            
            // N8N 응답에서 실제 결과 추출
            let result = statusData.result;
            if (statusData.result && statusData.result.subWorkflowResult) {
              result = statusData.result.subWorkflowResult;
            } else if (statusData.subWorkflowResult) {
              result = statusData.subWorkflowResult;
            }
            
            return {
              success: true,
              data: result as T,
              jobId,
              status: "completed",
            };
          } else if (statusData.status === "failed") {
            console.error("❌ Job 실패:", statusData.error);
            return {
              success: false,
              error: statusData.error || "Job 처리 실패",
              jobId,
              status: "failed",
            };
          }
          // pending 또는 processing 상태면 계속 폴링
        }
      } catch (error) {
        console.error("폴링 중 오류:", error);
        // CORS 에러나 네트워크 오류 처리
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.log("🌐 CORS 또는 네트워크 오류 발생, 계속 시도합니다...");
          // GET 요청 실패 시 POST로 재시도
          try {
            const postStatusUrl = `${this.baseURL}/webhook/get-job-status-webhook/get/${jobId}`;
            const postResponse = await fetch(postStatusUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              body: JSON.stringify({ jobId }),
              mode: "cors",
              signal,
            });
            
            if (postResponse.ok) {
              const statusData = await postResponse.json();
              console.log(`📊 Job 상태 (POST): ${statusData.status}`);
              
              if (statusData.status === "completed") {
                console.log("✅ Job 완료!");
                
                let result = statusData.result;
                if (statusData.result && statusData.result.subWorkflowResult) {
                  result = statusData.result.subWorkflowResult;
                } else if (statusData.subWorkflowResult) {
                  result = statusData.subWorkflowResult;
                }
                
                return {
                  success: true,
                  data: result as T,
                  jobId,
                  status: "completed",
                };
              }
            }
          } catch (postError) {
            console.log("POST 요청도 실패, 계속 폴링합니다...");
          }
        }
        // 다른 오류는 무시하고 계속 시도
      }

      // 다음 폴링까지 대기
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }

    // 최대 시간 초과
    console.error("⏱️ 최대 폴링 시간 초과");
    return {
      success: false,
      error: `${maxPollingTime / 1000}초 동안 응답을 받지 못했습니다.`,
      jobId,
      status: "timeout",
    };
  }

  // 진로 문장 생성 전용 메서드
  async requestCareerSentence(
    careerData: {
      careerField: string;
      request: string;
      aspiration?: string | null;
    },
    signal?: AbortSignal
  ): Promise<N8NPollingResponse<string>> {
    const response = await this.requestWithPolling<unknown>({
      endpoint: "dream",
      data: careerData,
      signal,
    });

    // 응답 데이터에서 텍스트 추출
    if (response.success && response.data) {
      const extractedText = this.extractTextFromResponse(response.data);
      return {
        ...response,
        data: extractedText,
      };
    }

    return response as N8NPollingResponse<string>;
  }

  // 연구 방법 생성 전용 메서드
  async requestResearchMethods(
    data: {
      topicName: string;
      timestamp: string;
      source: string;
      detailLevel?: string;
    },
    signal?: AbortSignal
  ): Promise<N8NPollingResponse<unknown>> {
    const response = await this.requestWithPolling({
      endpoint: "protocol",
      data,
      signal,
    });

    // 연구 방법 응답에서도 실현 가능성 데이터 필터링
    if (response.success && response.data) {
      const filteredData = this.filterFeasibilityData(response.data);
      return {
        ...response,
        data: filteredData,
      };
    }

    return response;
  }

  // 탐구 주제 생성 전용 메서드
  async requestTopics(
    data: {
      sentence: string;
      [key: string]: unknown;
    },
    signal?: AbortSignal
  ): Promise<N8NPollingResponse<unknown>> {
    const response = await this.requestWithPolling({
      endpoint: "topics",
      data,
      signal,
    });

    // 탐구 주제 응답에서도 실현 가능성 데이터 필터링
    if (response.success && response.data) {
      const filteredData = this.filterFeasibilityData(response.data);
      return {
        ...response,
        data: filteredData,
      };
    }

    return response;
  }

  // 실현 가능성 데이터 필터링 메서드
  private filterFeasibilityData(data: any): any {
    if (typeof data === 'string') {
      // 문자열에서 실현 가능성 관련 내용 제거
      return data
        .replace(/실현[\s]*가능성[\s]*[:：]?[\s]*[^\.]*\.?/gi, '')
        .replace(/실현[\s]*가능성[\s]*정보[\s]*없습니다\.?/gi, '')
        .replace(/\d+%[\s]*\([^)]*화학[^)]*\)/gi, '')
        .replace(/^\s*\d+%[\s]*.*$/gm, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.filterFeasibilityData(item));
    }
    
    if (data && typeof data === 'object') {
      const filtered = { ...data };
      // 실현 가능성 관련 키 제거
      delete filtered['실현 가능성'];
      delete filtered['실현_가능성'];
      delete filtered['feasibility'];
      delete filtered['실현가능성'];
      
      // 모든 값에 대해 재귀적으로 필터링
      Object.keys(filtered).forEach(key => {
        filtered[key] = this.filterFeasibilityData(filtered[key]);
      });
      
      return filtered;
    }
    
    return data;
  }

  // 응답에서 텍스트 추출하는 헬퍼 메서드
  private extractTextFromResponse(data: unknown): string {
    if (typeof data === "string") {
      return data;
    }

    // N8N dream 워크플로우의 응답 구조 처리
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      
      // 특정 경로에서 진로 문장 찾기
      const dataObj = obj.data as Record<string, unknown> | undefined;
      if (dataObj) {
        const careerObj = dataObj.진로_문장_후보 as Record<string, unknown> | undefined;
        if (careerObj && typeof careerObj.진로_문장 === 'string') {
          return careerObj.진로_문장;
        }
      }
      
      // 대체 경로들
      const careerCandidate = obj.진로_문장_후보 as Record<string, unknown> | undefined;
      if (careerCandidate && typeof careerCandidate.진로_문장 === 'string') {
        return careerCandidate.진로_문장;
      }
      
      if (typeof obj.진로_문장 === 'string') {
        return obj.진로_문장;
      }
      
      // 그 외의 경우 가장 긴 문자열 찾기
      const allValues: string[] = [];
      const extractValues = (obj: unknown): void => {
        if (typeof obj === "string" && obj.trim()) {
          allValues.push(obj.trim());
        } else if (obj && typeof obj === "object") {
          Object.values(obj as Record<string, unknown>).forEach(extractValues);
        }
      };
      extractValues(data);

      // 가장 긴 문자열을 반환
      if (allValues.length > 0) {
        return allValues.reduce((longest, current) =>
          current.length > longest.length ? current : longest
        );
      }
    }

    return "";
  }
}

// 싱글톤 인스턴스
export const n8nPollingClient = new N8NPollingClient();
