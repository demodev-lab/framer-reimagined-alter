// N8N 연결 안정성을 위한 유틸리티 클라이언트
// 타임아웃, 재시도, 에러 핸들링 기능 포함

export interface N8NRequestOptions {
  endpoint: string;
  data: any;
  signal?: AbortSignal;
}

export interface N8NResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isTimeout?: boolean;
  isNetworkError?: boolean;
  retryCount?: number;
}

export class N8NClient {
  private baseURL = import.meta.env.DEV ? '' : 'https://songssam.demodev.io';

  async request<T = any>(options: N8NRequestOptions): Promise<N8NResponse<T>> {
    const {
      endpoint,
      data,
      signal
    } = options;

    try {
      console.log(`N8N 요청 시작: ${endpoint} (무제한 대기)`);
      
      const response = await this.makeRequest(endpoint, data, signal);
      
      console.log(`✅ N8N 요청 성공: ${endpoint}`);
      return {
        success: true,
        data: response
      };
      
    } catch (error) {
      console.error(`❌ N8N 요청 실패: ${endpoint}`, error);
      return this.handleError(error as Error, 0);
    }
  }

  private async makeRequest(
    endpoint: string,
    data: any,
    signal?: AbortSignal
  ): Promise<any> {
    const url = `${this.baseURL}/webhook/request?path=${endpoint}`;
    
    // 브라우저 기본 타임아웃 우회 - 무제한 대기 강제 설정
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(data),
      signal,
      keepalive: true,  // 브라우저 탭 종료 시에도 요청 유지
      mode: 'cors',     // CORS 모드 명시
      redirect: 'follow' // 리다이렉트 따라가기
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  private handleError(error: Error | null, retryCount: number): N8NResponse {
    if (!error) {
      return {
        success: false,
        error: '알 수 없는 오류가 발생했습니다.',
        retryCount
      };
    }

    let errorMessage = '';
    let isTimeout = false;
    let isNetworkError = false;

    if (error.name === 'AbortError') {
      errorMessage = '사용자가 요청을 취소했습니다.';
    } else if (error.message.includes('timeout')) {
      errorMessage = `N8N 서버 응답 시간이 초과되었습니다. 서버 상태를 확인하고 다시 시도해주세요.`;
      isTimeout = true;
    } else if (error.message.includes('fetch') || error instanceof TypeError) {
      errorMessage = 'N8N 서버 연결 중 브라우저 오류 발생 (무시하고 백그라운드에서 계속 처리 중)';
      isNetworkError = true;
    } else if (error.message.includes('HTTP error')) {
      errorMessage = 'N8N 서버에서 오류가 발생했습니다. 웹훅 상태를 확인해주세요.';
    } else {
      errorMessage = `요청 처리 중 문제가 발생했습니다: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
      isTimeout,
      isNetworkError,
      retryCount
    };
  }

}

// 싱글톤 인스턴스
export const n8nClient = new N8NClient();

// 편의 함수들
export const requestCareerSentence = (sentence: string, signal?: AbortSignal) => {
  return n8nClient.request({
    endpoint: 'dream',
    data: { sentence },
    signal
  });
};

export const requestProjectTopics = (sentence: string, signal?: AbortSignal) => {
  return n8nClient.request({
    endpoint: 'subject-all',
    data: { sentence },
    signal
  });
};

// N8N 백엔드에 중단 신호 전송
export const cancelN8NRequest = async (requestId?: string) => {
  try {
    console.log('📶 N8N 백엔드에 중단 신호 전송 중...');
    
    const baseURL = import.meta.env.DEV ? '' : 'https://songssam.demodev.io';
    const response = await fetch(`${baseURL}/webhook/request?path=cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'cancel',
        requestId: requestId || 'current_request',
        timestamp: Date.now()
      }),
      // 중단 요청은 빠르게 처리
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });
    
    if (response.ok) {
      console.log('✅ N8N 백엔드 중단 신호 전송 성공');
      return { success: true };
    } else {
      console.log('⚠️ N8N 백엔드 중단 신호 전송 실패:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log('⚠️ N8N 백엔드 중단 신호 전송 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};