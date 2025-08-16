# 디자인 통일성 개선 계획 (Enhanced)

## 기존 계획 평가

### 강점
1. 로직 보존 원칙 명확
2. 단계별 구현 계획 체계적
3. 디자인 토큰 기본 구조 양호

### 보완 필요 사항
1. **구체적인 변경 파일 목록 부재** - 어떤 파일을 수정해야 하는지 불명확
2. **Tailwind 클래스 정리 전략 부족** - 중복되고 복잡한 클래스 정리 방안 필요
3. **커스텀 스타일 마이그레이션 계획 부재** - inline style을 어떻게 처리할지 불명확
4. **측정 가능한 성공 지표 부족** - 통일성 달성 여부를 어떻게 판단할지 불명확
5. **롤백 계획 미비** - 문제 발생 시 대응 방안 부재

## 개선된 디자인 통일성 계획

### 1. 디자인 토큰 상세 정의

#### 색상 팔레트 (Tailwind 기반)
```
// Primary
primary-gradient: "bg-gradient-to-r from-purple-600 to-purple-700"
primary-hover: "hover:from-purple-700 hover:to-purple-800"

// Neutral
bg-primary: "bg-gray-100"
bg-secondary: "bg-white"
bg-tertiary: "bg-gray-50"
text-primary: "text-gray-900"
text-secondary: "text-gray-600"
text-tertiary: "text-gray-500"

// Borders
border-default: "border-gray-200"
border-hover: "border-gray-300"
```

#### 타이포그래피 클래스 (모바일 우선)
```
// Headings
h1: "text-4xl md:text-5xl font-bold tracking-tight"
h2: "text-2xl md:text-3xl font-bold"
h3: "text-xl md:text-2xl font-bold"
h4: "text-lg font-semibold"

// Body
body-lg: "text-lg text-gray-600"
body: "text-base text-gray-600"
body-sm: "text-sm text-gray-500"
caption: "text-xs text-gray-400"
```

#### 컴포넌트 클래스 템플릿
```
// Containers
container-base: "container mx-auto px-4 sm:px-6 lg:px-8"
section-base: "py-16 md:py-20"

// Cards
card-base: "bg-white rounded-lg shadow-sm border border-gray-200 p-6"
card-hover: "hover:shadow-md transition-shadow duration-200"
card-feature: "bg-white rounded-3xl shadow-lg border border-gray-200 p-8"

// Buttons
btn-primary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
btn-secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
btn-size-default: "px-4 py-2 text-sm"
btn-size-lg: "px-6 py-3 text-base"
```

### 2. 파일별 구체적 변경 계획

#### Phase 1 대상 파일 (우선순위 높음)
```
1. src/components/Header.tsx
   - 버튼 스타일 통일 (gradient → btn-primary)
   - 네비게이션 링크 스타일 표준화

2. src/components/ui/card.tsx
   - 기본 카드 스타일 재정의
   - 변형(variant) 추가: default, feature

3. src/pages/TopicGenerator.tsx
   - 섹션 스페이싱 통일
   - 카드 컴포넌트 스타일 표준화

4. src/pages/Archive.tsx
   - 테이블/리스트 스타일 통일
   - 상태 뱃지 색상 체계화
```

#### Phase 2 대상 파일 (타이포그래피)
```
5. src/pages/Index.tsx
   - 모든 heading 클래스 표준화
   - Hero 섹션 타이포그래피 정리

6. src/components/topic-generator/*.tsx
   - 일관된 텍스트 스타일 적용
   - 아이콘 크기 표준화
```

### 3. 커스텀 스타일 처리 전략

#### Inline Style → Tailwind 변환 규칙
```javascript
// Before
style={{ boxShadow: "0 12px 24px rgba(147,51,234,0.4)" }}

// After
className="shadow-[0_12px_24px_rgba(147,51,234,0.4)]"
```

#### 복잡한 애니메이션 처리
```javascript
// 재사용 가능한 클래스로 추출
const animationClasses = {
  slideUp: "transform hover:translate-y-[-4px] transition-all duration-200",
  glow: "hover:shadow-[0_16px_32px_rgba(147,51,234,0.5)]"
}
```

### 4. 성공 지표 및 검증 방법

#### 정량적 지표
1. **클래스 중복 감소율**: 50% 이상
2. **커스텀 스타일 사용**: 90% 감소
3. **파일 크기**: 스타일 관련 코드 20% 감소

#### 검증 체크리스트
- [ ] 모든 버튼이 2가지 표준 스타일 중 하나 사용
- [ ] 모든 카드가 정의된 변형 중 하나 사용
- [ ] 타이포그래피 스케일 일관성
- [ ] 반응형 브레이크포인트 일관성
- [ ] 호버/포커스 상태 일관성

### 5. 안전한 구현을 위한 전략

#### Git 브랜치 전략
```bash
main
└── design-unification
    ├── phase-1-components
    ├── phase-2-typography
    ├── phase-3-interactions
    └── phase-4-special
```

#### 롤백 계획
1. 각 Phase별 별도 커밋
2. 시각적 변경사항 스크린샷 기록
3. 문제 발생 시 Phase 단위 롤백

### 6. 구현 가이드라인

#### 수정 시 주의사항
1. **절대 건드리지 말 것**:
   - React hooks
   - 상태 관리 로직
   - 이벤트 핸들러
   - API 호출 코드

2. **수정 가능한 것**:
   - className props
   - style props (Tailwind 클래스로 변환)
   - HTML 구조 (시맨틱 개선 목적만)

3. **보존해야 할 것**:
   - 접근성 속성 (aria-*, role)
   - 데이터 속성 (data-*)
   - ref 속성

## 구현 프롬프트

```
다음 디자인 통일성 계획을 실행해주세요:

1. **Phase 1 실행** (공통 컴포넌트)
   - src/components/Header.tsx의 모든 버튼을 표준 스타일로 변경
   - 버튼: primary는 gradient 스타일, secondary는 outline 스타일 사용
   - 네비게이션 링크 호버 효과 통일

2. **변경 규칙**:
   - 로직 코드는 절대 수정하지 않음
   - className과 style props만 수정
   - 복잡한 inline style은 Tailwind arbitrary value로 변환
   - 기존 기능성 유지 (onClick, hover 효과 등)

3. **표준 클래스 사용**:
   - 버튼 primary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-md font-semibold shadow-sm hover:shadow-md transition-all duration-200"
   - 버튼 secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-md font-medium transition-colors duration-200"
   - 카드: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"

4. **검증**:
   - 수정 후 시각적으로 확인
   - 반응형 디자인 유지 확인
   - 호버/클릭 인터랙션 작동 확인

각 파일 수정 시 변경 전후를 명확히 표시하고, 왜 그런 변경을 했는지 간단히 설명해주세요.
```