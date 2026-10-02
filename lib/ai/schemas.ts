export const problemSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    training_type: { type: 'string', enum: ['business','marketing','geo'] },
    difficulty: { type: 'string', enum: ['beginner','intermediate','advanced'] },
    industry: { type: 'string' },
    situation: { type: 'string' },
    problem_context: { type: 'string' },
    metrics: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'array', items: { type: 'string' } },
    task: { type: 'string' },
    evaluation_focus: { type: 'array', items: { type: 'string' } }
  },
  required: ['title','training_type','difficulty','industry','situation','problem_context','metrics','evidence','task','evaluation_focus']
} as const;

export const evaluationSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    score: { type: 'integer', minimum: 0, maximum: 100 },
    rubric: {
      type: 'object', additionalProperties: false,
      properties: {
        problem_definition: { type: 'integer', minimum: 0, maximum: 20 },
        cause_analysis: { type: 'integer', minimum: 0, maximum: 15 },
        evidence: { type: 'integer', minimum: 0, maximum: 15 },
        cause_hypothesis: { type: 'integer', minimum: 0, maximum: 15 },
        falsification: { type: 'integer', minimum: 0, maximum: 10 },
        validation: { type: 'integer', minimum: 0, maximum: 10 },
        solution_logic: { type: 'integer', minimum: 0, maximum: 10 },
        execution: { type: 'integer', minimum: 0, maximum: 5 }
      },
      required: ['problem_definition','cause_analysis','evidence','cause_hypothesis','falsification','validation','solution_logic','execution']
    },
    strengths: { type: 'array', items: { type: 'string' } },
    critical_errors: { type: 'array', items: { type: 'string' } },
    missing_evidence: { type: 'array', items: { type: 'string' } },
    recommended_revision: { type: 'array', items: { type: 'string' } },
    next_questions: { type: 'array', items: { type: 'string' } },
    parsed: {
      type: 'object', additionalProperties: false,
      properties: {
        problem_statement: { type: 'string' },
        cause_candidates: { type: 'string' },
        cause_hypothesis: { type: 'string' },
        falsification: { type: 'string' },
        validation_plan: { type: 'string' },
        solution_hypothesis: { type: 'string' },
        insight: { type: 'string' }
      },
      required: ['problem_statement','cause_candidates','cause_hypothesis','falsification','validation_plan','solution_hypothesis','insight']
    },
    feedback_summary: { type: 'string' },
    weakness_tags: { type: 'array', items: { type: 'string' } },
    strength_tags: { type: 'array', items: { type: 'string' } }
  },
  required: ['score','rubric','strengths','critical_errors','missing_evidence','recommended_revision','next_questions','parsed','feedback_summary','weakness_tags','strength_tags']
} as const;
