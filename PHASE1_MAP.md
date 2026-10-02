# Phase 1 Map

## IA
Home
- Sign Up
- Login
- Dashboard
  - 오늘의 경험 정리
  - Training
  - Experience Detail
  - Training Detail

## Data
Auth User
- profiles 1:1
- experiences 1:N
- training_sessions 1:N

## Phase 2 Hook
training_sessions에는 AI 평가를 위한 필드를 미리 포함합니다.
- score
- feedback
- critical_errors
- next_questions

Phase 2에서 서버 API를 추가하여 AI Problem Generator와 LLM Evaluator를 연결할 수 있습니다.
