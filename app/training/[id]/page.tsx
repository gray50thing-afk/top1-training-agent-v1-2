import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const labels:any={
  training_type:'유형',difficulty:'난이도',industry:'산업',question:'문제',answer:'최초 답안',revision_answer:'수정 답안',
  problem_statement:'Problem Statement',cause_candidates:'원인 후보',cause_hypothesis:'Cause Hypothesis',falsification:'반증 조건',
  validation_plan:'검증 계획',solution_hypothesis:'Solution Hypothesis',insight:'Insight',initial_score:'최초 점수',revised_score:'수정 점수',score_delta:'개선폭',
  feedback:'AI Feedback',strengths:'강점',critical_errors:'Critical Errors',missing_evidence:'누락 근거',rubric:'Rubric',next_questions:'Next Questions',weakness_tags:'약점 태그',strength_tags:'강점 태그'
};
function render(v:any){if(v==null||v==='')return '-';if(typeof v==='object')return JSON.stringify(v,null,2);return String(v)}
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user) redirect('/login');
  const {data}=await supabase.from('training_sessions').select('*').eq('id',id).single();if(!data) notFound();
  return <><div className="heroRow"><div><span className="eyebrow">TRAINING RECORD</span><h1>{data.title}</h1></div>{data.score!=null&&<div className="scoreMini"><strong>{data.score}</strong><span>/100</span></div>}</div>{Object.entries(labels).map(([k,l])=><div className="card" key={k}><h2>{l as string}</h2><p className="pre">{render(data[k])}</p></div>)}</>
}
