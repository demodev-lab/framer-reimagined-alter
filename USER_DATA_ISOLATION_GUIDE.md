# 사용자별 데이터 격리 구현 가이드

## 현재 문제
- 카카오 계정과 구글 계정에서 동일한 데이터(진로 문장, 탐구 주제)가 표시됨
- localStorage를 사용하여 브라우저 단위로 데이터가 저장되어 있음

## 해결 방안 구현

### 1. Supabase 테이블 생성 (필수)

Supabase 대시보드의 SQL Editor에서 다음 쿼리를 실행하세요:

```sql
-- Create topic_sessions table for storing user-specific topic generator state
CREATE TABLE IF NOT EXISTS public.topic_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  carousel_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  locked_topics TEXT[] DEFAULT '{}',
  follow_up_states JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_topic_sessions_user_id ON public.topic_sessions(user_id);

-- Enable RLS
ALTER TABLE public.topic_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own topic sessions"
  ON public.topic_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic sessions"
  ON public.topic_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic sessions"
  ON public.topic_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topic sessions"
  ON public.topic_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_topic_sessions_updated_at
  BEFORE UPDATE ON public.topic_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.topic_sessions IS 'Stores user-specific topic generator state including carousel groups, locked topics, and follow-up states';
```

### 2. 구현된 변경사항

#### A. `useTopicManager` 훅 수정 완료
- localStorage 대신 Supabase `topic_sessions` 테이블 사용
- 사용자별 세션 자동 생성 및 관리
- 실시간 자동 저장 (1초 디바운스)
- 기존 localStorage 데이터 자동 마이그레이션

#### B. 보관함 (ArchiveContext)
- 이미 Supabase를 사용하여 사용자별 데이터 분리 구현됨
- `topics` 테이블에 `user_id`로 필터링

#### C. 진로 문장 (CareerSentenceContext)
- Supabase `sentences` 테이블 사용
- 사용자별 진로 문장 저장 및 조회

### 3. 테스트 방법

1. **브라우저 콘솔에서 디버깅**
   ```javascript
   // 현재 세션 정보 확인
   debugSessionInfo()
   
   // 세션 초기화
   clearTopicSession()
   
   // localStorage 클리어
   clearArchiveLocalStorage()
   clearCareerSentenceStorage()
   ```

2. **계정별 데이터 확인**
   - 카카오 계정으로 로그인 → 탐구 주제 생성
   - 로그아웃 → 구글 계정으로 로그인
   - 다른 데이터가 표시되는지 확인

### 4. 문제 해결

#### 404 에러 발생 시
- Supabase 대시보드에서 `topic_sessions` 테이블이 생성되었는지 확인
- RLS 정책이 올바르게 설정되었는지 확인

#### 데이터가 여전히 공유되는 경우
1. 브라우저 콘솔에서 localStorage 클리어:
   ```javascript
   localStorage.clear()
   ```
2. 페이지 새로고침
3. 다시 로그인

### 5. 주요 기능

- **자동 마이그레이션**: 기존 localStorage 데이터를 처음 로그인 시 자동으로 Supabase로 이전
- **오프라인 지원**: Supabase 연결 실패 시 localStorage 폴백
- **실시간 동기화**: 변경사항 자동 저장
- **사용자별 격리**: RLS 정책으로 다른 사용자의 데이터 접근 차단

### 6. 추가 권장사항

1. **정기적인 백업**: Supabase 대시보드에서 데이터 백업 설정
2. **모니터링**: Supabase 대시보드에서 쿼리 성능 모니터링
3. **보안**: RLS 정책 정기적 검토

## 완료된 작업
- ✅ 사용자별 데이터 격리 로직 구현
- ✅ Supabase 연동 코드 작성
- ✅ 마이그레이션 로직 구현
- ✅ 디버깅 도구 제공

## 남은 작업
- ⏳ Supabase 대시보드에서 위의 SQL 쿼리 실행 (필수)
- ⏳ 각 계정별 테스트