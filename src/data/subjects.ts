// 한국 고등학교 교과목 데이터
export const SUBJECTS = [
  // 공통 과목
  "국어",
  "수학", 
  "영어",
  "통합사회",
  "통합과학",
  "한국사",
  "체육",
  "음악",
  "미술",
  
  // 일반선택 과목
  "화법과 언어",
  "독서와 작문", 
  "문학",
  "대수",
  "미적분Ⅰ",
  "확률과 통계",
  "영어Ⅰ",
  "영어Ⅱ",
  "영어 독해와 작문",
  "세계시민과 지리",
  "세계사",
  "사회와 문화",
  "현대사회와 윤리",
  "물리학",
  "화학",
  "생명과학",
  "지구과학",
  "기술·가정",
  "정보",
  "독일어",
  "프랑스어",
  "스페인어",
  "중국어",
  "일본어",
  "러시아어",
  "아랍어",
  "베트남어",
  "한문",
  "진로와 직업",
  "생태와 환경",
  
  // 진로선택 과목
  "문학과 영상",
  "직무 의사소통",
  "주제 탐구 독서",
  "기하",
  "미적분Ⅱ",
  "경제수학",
  "인공지능 수학",
  "직무 수학",
  "영미문학 읽기",
  "영어 발표와 토론",
  "심화 영어",
  "심화 영어 독해와 작문",
  "직무 영어",
  "한국지리 탐구",
  "도시의 미래 탐구",
  "동아시아 역사 기행",
  "정치·법과 사회",
  "경제",
  "윤리와 사상",
  "국제 관계의 이해",
  "역학과 에너지",
  "전자기와 양자",
  "물질과 에너지",
  "화학 반응의 세계",
  "세포와 물질대사",
  "생물의 유전",
  "지구시스템과학",
  "행성우주과학",
  "운동과 건강",
  "스포츠 문화",
  "스포츠 과학",
  "음악 연주와 창작",
  "음악 감상과 비평",
  "미술 창작",
  "미술 감상과 비평",
  "로봇과 공학세계",
  "생활과학 탐구",
  "인공지능 기초",
  "데이터 과학",
  "독일어 회화",
  "심화 독일어",
  "프랑스어 회화",
  "심화 프랑스어",
  "스페인어 회화",
  "심화 스페인어",
  "중국어 회화",
  "심화 중국어",
  "일본어 회화",
  "심화 일본어",
  "러시아어 회화",
  "심화 러시아어",
  "한문 고전 읽기",
  
  // 융합선택 과목
  "독서 토론과 글쓰기",
  "매체 의사소통",
  "언어생활 탐구",
  "수학과 문화",
  "실용 통계",
  "수학과제 탐구",
  "실생활 영어 회화",
  "미디어 영어",
  "세계 문화와 영어",
  "여행지리",
  "역사로 탐구하는 현대세계",
  "사회문제 탐구",
  "금융과 경제생활",
  "윤리문제 탐구",
  "기후변화와 지속가능한 세계",
  "과학의 역사와 문화",
  "기후변화와 환경생태",
  "융합과학 탐구",
  "스포츠 생활1",
  "스포츠 생활2",
  "음악과 미디어",
  "미술과 매체",
  "창의 공학 설계",
  "지식 재산 일반",
  "아동발달과 부모",
  "생애 설계와 자립",
  "소프트웨어와 생활",
  "독일어권 문화",
  "프랑스어권 문화",
  "스페인어권 문화",
  "중국어권 문화",
  "일본어권 문화",
  "러시아어권 문화",
  "언어생활과 한자",
  "인간과 철학",
  "논리와 사고",
  "인간과 심리",
  "교육의 이해",
  "삶과 종교",
  "보건",
  "인간과 경제활동",
  "논술"
];

// 교과목 별명/줄임말 매핑
export const SUBJECT_ALIASES: Record<string, string[]> = {
  "생명과학": ["생과", "생물"],
  "물리학": ["물리"],
  "화학": ["화학"],
  "지구과학": ["지과", "지구"],
  "수학": ["수학"],
  "국어": ["국문"],
  "영어": ["영문"],
  "체육": ["체육"],
  "음악": ["음악"],
  "미술": ["미술"],
  "한국사": ["한사"],
  "세계사": ["세사"],
  "통합사회": ["통사"],
  "통합과학": ["통과"],
  "사회와 문화": ["사문"],
  "정치·법과 사회": ["정법"],
  "경제": ["경제"],
  "윤리와 사상": ["윤리"],
  "한국지리 탐구": ["한지"],
  "세계시민과 지리": ["세지"],
  "확률과 통계": ["확통"],
  "미적분": ["미적"],
  "기하": ["기하"],
  "인공지능 수학": ["AI수학"],
  "데이터 과학": ["데이터사이언스"],
  "인공지능 기초": ["AI기초"]
};

// 한글 초성 추출 함수
export function getInitialConsonants(text: string): string {
  const initials = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0) - 44032;
    if (code >= 0 && code <= 11171) {
      return initials[Math.floor(code / 588)];
    }
    return char;
  }).join('');
}

// 교과목 검색 함수
export function searchSubjects(query: string): string[] {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  const queryInitials = getInitialConsonants(query);
  
  const results = SUBJECTS.filter(subject => {
    // 1. 정확한 매치
    if (subject.includes(query)) return true;
    
    // 2. 소문자 매치
    if (subject.toLowerCase().includes(lowercaseQuery)) return true;
    
    // 3. 초성 매치
    const subjectInitials = getInitialConsonants(subject);
    if (subjectInitials.includes(queryInitials)) return true;
    
    // 4. 별명/줄임말 매치
    const aliases = SUBJECT_ALIASES[subject] || [];
    return aliases.some(alias => 
      alias.includes(query) || 
      alias.toLowerCase().includes(lowercaseQuery)
    );
  });
  
  // 정확한 매치를 우선순위로 정렬
  return results.sort((a, b) => {
    const aExact = a.startsWith(query);
    const bExact = b.startsWith(query);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return a.localeCompare(b);
  }).slice(0, 8); // 최대 8개 결과만 표시
}