# Phase 2 — v1.2 AI Coach

## Goal
사용자가 실무 문제를 풀면 AI가 동일한 100점 Rubric으로 평가하고, 수정 답안 재평가와 DB 저장까지 수행한다.

## Flow
AI Problem Generator → User Answer → Evaluator → Feedback → Revision → Re-evaluation → Supabase Save

## Routes
- `/training/ai` AI 훈련 화면
- `/api/training/generate` 문제 생성
- `/api/training/evaluate` 평가 및 DB 저장
- `/training/[id]` 누적 기록 상세

## Rubric 100
- 문제 정의 20
- 원인 분석 15
- 근거 활용 15
- 원인 가설 15
- 반증 조건 10
- 검증 설계 10
- 해결책 연결성 10
- 실행 가능성 5

## Required env
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SITE_URL
- OPENAI_API_KEY
- OPENAI_MODEL (optional, default gpt-5.5)

## Supabase migration
Run `supabase/phase2.sql` once after the Phase 1 schema.
