import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// PDF.js 워커 설정 - CDN 사용
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export interface SubjectTopic {
  subject: string;
  topics: string[];
}

export interface GradeData {
  grade: number;
  subjects: SubjectTopic[];
}

// PDF에서 텍스트 추출
const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log('PDF 텍스트 추출 시작:', file.name);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    console.log(`PDF 페이지 수: ${pdf.numPages}`);
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
        console.log(`페이지 ${i} 텍스트 추출 완료`);
      } catch (pageError) {
        console.warn(`페이지 ${i} 처리 중 오류:`, pageError);
        // 개별 페이지 오류는 무시하고 계속 진행
      }
    }
    
    console.log('PDF 텍스트 추출 완료, 총 길이:', fullText.length);
    return fullText;
  } catch (error) {
    console.error('PDF 텍스트 추출 오류:', error);
    
    // 더 구체적인 오류 메시지 제공
    if (error instanceof Error) {
      if (error.message.includes('worker') || error.message.includes('Worker')) {
        throw new Error('PDF 처리 중 오류가 발생했습니다. 브라우저 호환성 문제일 수 있습니다.');
      } else if (error.message.includes('Invalid PDF')) {
        throw new Error('유효하지 않은 PDF 파일입니다. 다른 파일을 선택해주세요.');
      } else if (error.message.includes('fetch')) {
        throw new Error('PDF 처리를 위한 리소스 로딩에 실패했습니다. 인터넷 연결을 확인해주세요.');
      }
    }
    
    throw new Error('PDF 파일을 읽을 수 없습니다. 파일이 손상되었거나 암호화되어 있을 수 있습니다.');
  }
};

// 이미지에서 OCR로 텍스트 추출
const extractTextFromImage = async (file: File): Promise<string> => {
  console.log('이미지 OCR 텍스트 추출 시작:', file.name);
  
  try {
    const worker = await createWorker('kor+eng');
    console.log('Tesseract 워커 생성 완료');
    
    const { data: { text } } = await worker.recognize(file);
    console.log('OCR 텍스트 추출 완료, 길이:', text.length);
    
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('이미지 OCR 오류:', error);
    throw new Error('이미지에서 텍스트를 추출할 수 없습니다. 이미지가 선명하지 않거나 지원하지 않는 형식일 수 있습니다.');
  }
};

// 텍스트에서 탐구 주제와 과목 정보 분석
const analyzeTextForResearchTopics = (text: string): GradeData[] => {
  console.log('텍스트 분석 시작, 길이:', text.length);
  
  // 과목별 키워드 매핑
  const subjectKeywords: { [key: string]: string[] } = {
    '수학': ['수학', '미적분', '통계', '확률', '기하', '함수', '방정식', '미분', '적분'],
    '국어': ['국어', '문학', '작품', '시', '소설', '고전', '현대문학', '언어'],
    '영어': ['영어', '영문학', 'English', '회화', '독해', '문법'],
    '과학': ['과학', '실험', '탐구', '관찰', '가설'],
    '물리': ['물리', '역학', '전기', '자기', '광학', '열역학', '양자'],
    '화학': ['화학', '분자', '원소', '반응', '화합물', '이온', '산화', '환원'],
    '생명과학': ['생물', '생명과학', '세포', '유전', 'DNA', '진화', '생태'],
    '지구과학': ['지구과학', '지질', '기상', '천문', '환경', '기후'],
    '사회': ['사회', '역사', '지리', '정치', '경제', '법', '윤리', '철학'],
    '역사': ['역사', '근대', '현대', '고대', '중세', '조선', '고려'],
    '지리': ['지리', '기후', '지형', '인구', '도시', '농업', '공업'],
    '미술': ['미술', '그림', '조형', '색채', '디자인', '작품', '표현'],
    '음악': ['음악', '연주', '작곡', '리듬', '멜로디', '화성', '악기'],
    '체육': ['체육', '운동', '스포츠', '건강', '체력', '경기', '훈련'],
    '기술가정': ['기술', '가정', '컴퓨터', '프로그래밍', '요리', '재봉'],
    '한문': ['한문', '한자', '고전', '사서삼경']
  };

  // 학년 키워드
  const gradeKeywords = ['1학년', '2학년', '3학년', '고1', '고2', '고3'];
  
  const results: GradeData[] = [];
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
  
  console.log('분석할 문장 수:', sentences.length);
  
  // 학년별로 데이터 수집
  for (let grade = 1; grade <= 3; grade++) {
    const gradeData: GradeData = {
      grade,
      subjects: []
    };
    
    const subjectTopics: { [key: string]: Set<string> } = {};
    
    sentences.forEach(sentence => {
      // 해당 학년과 관련된 문장인지 확인
      const isRelevantGrade = 
        sentence.includes(`${grade}학년`) || 
        sentence.includes(`고${grade}`) ||
        (!gradeKeywords.some(keyword => sentence.includes(keyword))); // 학년 언급이 없으면 모든 학년에 포함
      
      if (isRelevantGrade) {
        // 각 과목별로 키워드가 포함된 문장 찾기
        Object.entries(subjectKeywords).forEach(([subject, keywords]) => {
          const hasSubjectKeyword = keywords.some(keyword => 
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (hasSubjectKeyword) {
            // 탐구 활동을 나타내는 키워드가 있는지 확인
            const researchKeywords = [
              '탐구', '연구', '분석', '조사', '실험', '관찰', '프로젝트', 
              '과제', '발표', '보고서', '토론', '논문', '설계', '제작',
              '활동', '체험', '견학', '답사', '인터뷰'
            ];
            
            const hasResearchKeyword = researchKeywords.some(keyword => 
              sentence.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (hasResearchKeyword && sentence.trim().length > 20) {
              if (!subjectTopics[subject]) {
                subjectTopics[subject] = new Set();
              }
              
              // 문장을 정리하여 탐구 주제로 추가
              let topic = sentence.trim()
                .replace(/^\d+\.\s*/, '') // 앞의 숫자 제거
                .replace(/^-\s*/, '') // 앞의 하이픈 제거
                .replace(/\s+/g, ' ') // 연속된 공백 하나로
                .substring(0, 100); // 최대 길이 제한
              
              if (topic.length > 15) {
                subjectTopics[subject].add(topic);
              }
            }
          }
        });
      }
    });
    
    // Set을 배열로 변환하여 결과에 추가
    Object.entries(subjectTopics).forEach(([subject, topicsSet]) => {
      if (topicsSet.size > 0) {
        gradeData.subjects.push({
          subject,
          topics: Array.from(topicsSet).slice(0, 5) // 최대 5개까지
        });
      }
    });
    
    if (gradeData.subjects.length > 0) {
      results.push(gradeData);
    }
  }
  
  console.log('텍스트 분석 완료, 추출된 학년 수:', results.length);
  console.log('분석 결과:', results);
  
  // 결과가 없으면 기본 데이터 반환
  if (results.length === 0) {
    console.log('분석 결과가 없어 기본 데이터 반환');
    return [{
      grade: 1,
      subjects: [{
        subject: '일반',
        topics: ['파일에서 구체적인 탐구 주제를 찾을 수 없습니다. 생활기록부의 세부능력 및 특기사항 부분을 확인해주세요.']
      }]
    }];
  }
  
  return results;
};

// 파일에서 텍스트를 추출하는 함수
export const extractTextFromFile = async (file: File): Promise<string> => {
  console.log('파일에서 텍스트 추출 시작:', file.name, file.type, file.size);
  
  try {
    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(file);
    } else if (file.type.startsWith('image/')) {
      extractedText = await extractTextFromImage(file);
    } else {
      throw new Error('지원하지 않는 파일 형식입니다. PDF 또는 이미지 파일을 업로드해주세요.');
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('파일에서 텍스트를 찾을 수 없습니다. 파일이 빈 페이지이거나 텍스트가 이미지 형태로만 되어 있을 수 있습니다.');
    }
    
    console.log('텍스트 추출 완료, 길이:', extractedText.length);
    return extractedText;
  } catch (error) {
    console.error('파일에서 텍스트 추출 오류:', error);
    throw error;
  }
};

// 텍스트에서 탐구 주제를 추출하는 함수
export const extractResearchTopics = (text: string, fileName: string = "", fileSize: number = 0): GradeData[] => {
  console.log("탐구 주제 추출 시작:", { textLength: text.length, fileName, fileSize });
  
  const result = analyzeTextForResearchTopics(text);
  
  console.log("추출된 탐구 주제:", result);
  return result;
};
