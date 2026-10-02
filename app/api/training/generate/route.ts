import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAI, OPENAI_MODEL } from '@/lib/ai/openai';
import { GENERATOR_PROMPT } from '@/lib/ai/prompts';
import { problemSchema } from '@/lib/ai/schemas';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const body = await req.json();
    const trainingType = ['business','marketing','geo'].includes(body.training_type) ? body.training_type : 'marketing';
    const difficulty = ['beginner','intermediate','advanced'].includes(body.difficulty) ? body.difficulty : 'intermediate';
    const industry = String(body.industry || '임의의 산업').slice(0, 80);

    const client = getOpenAI();
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: GENERATOR_PROMPT,
      input: `훈련 유형: ${trainingType}\n난이도: ${difficulty}\n산업: ${industry}\n이 조건에 맞는 새로운 실무 케이스 1개를 생성하라.`,
      text: {
        format: {
          type: 'json_schema',
          name: 'training_problem',
          strict: true,
          schema: problemSchema
        }
      }
    });

    const problem = JSON.parse(response.output_text);
    return NextResponse.json({ problem });
  } catch (error: any) {
    console.error('generate training problem error', error);
    return NextResponse.json({ error: error?.message || '문제 생성에 실패했습니다.' }, { status: 500 });
  }
}
