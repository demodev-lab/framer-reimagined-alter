# 디자인 통일성 개선 계획

## 목표
로직을 전혀 건드리지 않고 순수하게 스타일링만 수정하여 디자인 통일성을 확보

## 주요 원칙
1. **기존 shadcn/ui 디자인 시스템 활용** - 이미 구축된 컴포넌트 라이브러리 최대한 활용
2. **계층적 일관성** - 동일 계층의 컴포넌트는 동일한 스타일 규칙 적용
3. **점진적 개선** - 로직 변경 없이 className과 style props만 수정

## 디자인 토큰 표준화

### 1. 색상 체계
```
Primary: Purple gradient (from-purple-600 to-purple-700)
Secondary: Gray scale
Background: gray-100 (main), white (cards)
Text: gray-900 (heading), gray-600 (body)
```

### 2. 타이포그래피 스케일
```
Heading 1: text-4xl md:text-5xl font-bold
Heading 2: text-2xl md:text-3xl font-bold  
Heading 3: text-xl font-bold
Body: text-base text-gray-600
Small: text-sm text-gray-500
```

### 3. 스페이싱 시스템
```
Container: px-4 sm:px-6 lg:px-8
Section: py-16 md:py-20
Card padding: p-6
Component gap: gap-4 or gap-6
```

### 4. 컴포넌트 스타일 표준

#### 버튼
- **Primary**: shadcn/ui Button with custom gradient className
- **Secondary**: Button variant="outline"
- **크기**: 기본 h-10, 대형 CTA는 px-8 py-3

#### 카드
- **기본**: rounded-lg shadow-sm border
- **호버**: hover:shadow-md transition-shadow
- **특수**: 기존 rounded-3xl 카드는 feature 카드로 분류

#### 그림자
```
기본: shadow-sm
호버: shadow-md
강조: shadow-lg
특수효과: 기존 custom shadow 유지 (feature 카드만)
```

## 구현 계획

### Phase 1: 공통 컴포넌트 통일
1. Header 컴포넌트의 버튼 스타일 통일
2. Card 기반 컴포넌트들의 패딩, 그림자, border-radius 통일
3. 모든 페이지의 container 및 section 스페이싱 통일

### Phase 2: 타이포그래피 정리
1. 모든 heading 태그의 크기 및 weight 표준화
2. body text 색상 및 크기 통일
3. 특수 텍스트(gradient text) 사용 규칙 정립

### Phase 3: 인터랙션 패턴 통일
1. 호버 효과 표준화 (transform, shadow 변화)
2. 트랜지션 duration 통일 (duration-200)
3. 포커스 상태 스타일 일관성 확보

### Phase 4: 특수 컴포넌트 정리
1. Carousel 컴포넌트의 네비게이션 스타일 통일
2. Modal/Dialog 스타일 표준화
3. Form 요소들의 일관된 스타일링

## 예외 사항
- Index 페이지의 Hero 섹션 gradient 버튼은 브랜딩 요소로 유지
- Video 카드의 특수 그림자 효과는 강조 요소로 유지
- Lock 기능 관련 UI는 기능적 특성상 현재 스타일 유지

## 적용 우선순위
1. **높음**: 사용자가 자주 접하는 TopicGenerator, Archive 페이지
2. **중간**: Index, Feedback 페이지
3. **낮음**: Login, About 등 부가 페이지

## 검증 방법
- 각 컴포넌트 수정 후 시각적 regression 테스트
- 반응형 디자인 유지 확인
- 접근성 기능 손상 없음 확인