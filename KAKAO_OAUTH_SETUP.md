# Kakao OAuth 설정 가이드

## 1. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Supabase 설정

### 2.1 Kakao Provider 활성화
1. Supabase 대시보드에서 Authentication > Providers로 이동
2. Kakao를 찾아서 활성화
3. 다음 정보를 입력:
   - Client ID: Kakao Developers에서 발급받은 REST API 키
   - Client Secret: Kakao Developers > 보안 > Client Secret 코드

### 2.2 Redirect URL 확인
Supabase에서 제공하는 Redirect URL을 복사하세요:
```
https://[your-project-ref].supabase.co/auth/v1/callback
```

## 3. Kakao Developers 설정

### 3.1 애플리케이션 생성
1. [Kakao Developers](https://developers.kakao.com)에 로그인
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 이름과 사업자명 입력

### 3.2 플랫폼 설정
1. 내 애플리케이션 > 앱 설정 > 플랫폼
2. Web 플랫폼 추가
3. 사이트 도메인에 앱 URL 추가 (예: http://localhost:5173)

### 3.3 Redirect URI 등록
1. 내 애플리케이션 > 카카오 로그인
2. Redirect URI에 Supabase에서 복사한 URL 추가

### 3.4 동의항목 설정
1. 내 애플리케이션 > 카카오 로그인 > 동의항목
2. 다음 항목 설정:
   - 닉네임: 필수 동의
   - 프로필 사진: 선택 동의
   - 카카오계정(이메일): 선택 동의

### 3.5 보안 설정
1. 내 애플리케이션 > 앱 설정 > 보안
2. Client Secret 코드 생성 > 활성화
3. 생성된 코드를 Supabase Kakao Provider 설정에 입력

## 4. 테스트
1. 개발 서버 실행: `pnpm run dev`
2. `/login` 페이지로 이동
3. "카카오로 계속하기" 버튼 클릭
4. Kakao 로그인 화면에서 인증
5. 성공 시 홈페이지로 리다이렉트

## 주의사항
- 프로덕션 배포 시 Kakao Developers에서 실제 도메인을 추가해야 합니다
- Client Secret은 절대 클라이언트 코드에 노출되면 안 됩니다
- Supabase URL과 Anon Key는 공개되어도 괜찮지만, Service Role Key는 절대 노출되면 안 됩니다