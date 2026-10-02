# 극소수 v1.2 — AI Coach

Phase 1의 회원·개인 DB 위에 AI 문제 생성, 100점 평가, 피드백, 수정 답안 재평가를 추가한 버전입니다.

## 포함 기능
- Supabase Auth 회원가입 / 로그인 / 로그아웃
- 오늘의 경험 정리
- 수동 Training 기록
- AI Business / Marketing / GEO 문제 생성
- 100점 고정 Rubric 자동 평가
- 강점 / 핵심 오류 / 누락 근거 / 개선 방향 / 다음 질문
- 수정 답안 재평가와 Score Delta 저장
- Dashboard 최근 점수와 개선폭

## 1. Phase 1 DB가 이미 있다면
Supabase SQL Editor에서 `supabase/phase2.sql`만 실행합니다.

## 2. 환경변수
Vercel Environment Variables에 아래를 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN.vercel.app
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5.5
```

`OPENAI_API_KEY`는 절대 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. 서버에서만 사용합니다.

## 3. 배포
GitHub에 v1.2 파일을 올리고 Vercel에서 redeploy 합니다. 기존 v1.1 프로젝트를 업데이트해도 되고, 테스트용 v1.2 프로젝트를 별도로 만들어도 됩니다.

## 4. 테스트
1. 로그인
2. `/training/ai` 이동
3. AI 문제 생성
4. 3개 답안 블록 작성
5. AI 평가 받기
6. 피드백을 반영해 수정
7. 수정 답안 재평가
8. `/training/[id]`에서 저장값 확인
9. Supabase `training_sessions`에서 initial_score, revised_score, score_delta 확인
