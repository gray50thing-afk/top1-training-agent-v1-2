import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAI, OPENAI_MODEL } from '@/lib/ai/openai';
import { EVALUATOR_PROMPT } from '@/lib/ai/prompts';
import { evaluationSchema } from '@/lib/ai/schemas';

function buildAnswer(body:any) {
  return [
    `문제 정의\n${String(body.problem_definition || '').trim()}`,
    `원인과 가설\n${String(body.cause_hypothesis || '').trim()}`,
    `검증과 해결\n${String(body.validation_solution || '').trim()}`
  ].join('\n\n');
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const body = await req.json();
    const problem = body.problem;
    if (!problem?.title) return NextResponse.json({ error: '훈련 문제가 없습니다.' }, { status: 400 });

    const answer = buildAnswer(body);
    if (answer.length < 80) return NextResponse.json({ error: '답안을 조금 더 구체적으로 작성해 주세요.' }, { status: 400 });

    const client = getOpenAI();
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: EVALUATOR_PROMPT,
      input: `다음 훈련 문제와 사용자의 답안을 평가하라.\n\n[문제]\n${JSON.stringify(problem, null, 2)}\n\n[사용자 답안]\n${answer}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'training_evaluation',
          strict: true,
          schema: evaluationSchema
        }
      }
    });

    const evaluation = JSON.parse(response.output_text);
    const isRevision = Boolean(body.session_id);
    let sessionId = body.session_id || null;

    if (!isRevision) {
      const payload = {
        user_id: user.id,
        title: problem.title,
        training_type: problem.training_type,
        difficulty: problem.difficulty,
        industry: problem.industry,
        question: [problem.situation, problem.problem_context, ...(problem.metrics||[]), ...(problem.evidence||[]), problem.task].join('\n'),
        answer,
        problem_statement: evaluation.parsed.problem_statement,
        cause_candidates: evaluation.parsed.cause_candidates,
        cause_hypothesis: evaluation.parsed.cause_hypothesis,
        falsification: evaluation.parsed.falsification,
        validation_plan: evaluation.parsed.validation_plan,
        solution_hypothesis: evaluation.parsed.solution_hypothesis,
        insight: evaluation.parsed.insight,
        score: evaluation.score,
        initial_score: evaluation.score,
        feedback: evaluation.feedback_summary,
        critical_errors: evaluation.critical_errors,
        next_questions: evaluation.next_questions,
        strengths: evaluation.strengths,
        missing_evidence: evaluation.missing_evidence,
        weakness_tags: evaluation.weakness_tags,
        strength_tags: evaluation.strength_tags,
        rubric: evaluation.rubric,
        ai_problem: problem
      };
      const { data, error } = await supabase.from('training_sessions').insert(payload).select('id').single();
      if (error) throw new Error(error.message);
      sessionId = data.id;
    } else {
      const { data: existing, error: findError } = await supabase.from('training_sessions').select('initial_score').eq('id', sessionId).single();
      if (findError || !existing) throw new Error('기존 훈련 기록을 찾을 수 없습니다.');
      const initial = existing.initial_score ?? evaluation.score;
      const { error } = await supabase.from('training_sessions').update({
        revision_answer: answer,
        revised_score: evaluation.score,
        score: evaluation.score,
        score_delta: evaluation.score - initial,
        feedback: evaluation.feedback_summary,
        critical_errors: evaluation.critical_errors,
        next_questions: evaluation.next_questions,
        strengths: evaluation.strengths,
        missing_evidence: evaluation.missing_evidence,
        weakness_tags: evaluation.weakness_tags,
        strength_tags: evaluation.strength_tags,
        rubric: evaluation.rubric,
        problem_statement: evaluation.parsed.problem_statement,
        cause_candidates: evaluation.parsed.cause_candidates,
        cause_hypothesis: evaluation.parsed.cause_hypothesis,
        falsification: evaluation.parsed.falsification,
        validation_plan: evaluation.parsed.validation_plan,
        solution_hypothesis: evaluation.parsed.solution_hypothesis,
        insight: evaluation.parsed.insight,
        updated_at: new Date().toISOString()
      }).eq('id', sessionId);
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ evaluation, session_id: sessionId, revision: isRevision });
  } catch (error: any) {
    console.error('evaluate training answer error', error);
    return NextResponse.json({ error: error?.message || '평가에 실패했습니다.' }, { status: 500 });
  }
}
