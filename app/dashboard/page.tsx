import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Page(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect('/login');
  const [{data:ex},{data:tr}]=await Promise.all([
    supabase.from('experiences').select('id,title,created_at').order('created_at',{ascending:false}).limit(10),
    supabase.from('training_sessions').select('id,title,training_type,score,initial_score,revised_score,score_delta,created_at').order('created_at',{ascending:false}).limit(10)
  ]);
  const scored=(tr||[]).filter(x=>x.score!=null);
  const avg=scored.length?Math.round(scored.reduce((a,x)=>a+(x.score||0),0)/scored.length):null;
  const revised=(tr||[]).filter(x=>x.revised_score!=null);
  const avgDelta=revised.length?Math.round(revised.reduce((a,x)=>a+(x.score_delta||0),0)/revised.length):null;
  return <>
    <div className="heroRow"><div><span className="eyebrow">TOP 1% PROBLEM SOLVING OS</span><h1>Dashboard</h1><p className="muted">{user.email}</p></div></div>
    <div className="statsGrid"><div className="stat"><span>최근 훈련 수</span><strong>{tr?.length||0}</strong></div><div className="stat"><span>평균 점수</span><strong>{avg??'-'}</strong></div><div className="stat"><span>평균 수정 개선폭</span><strong>{avgDelta!=null?`${avgDelta>=0?'+':''}${avgDelta}`:'-'}</strong></div></div>
    <div className="grid"><div className="card"><h2>AI 문제 해결 훈련</h2><p>AI가 실무 케이스를 출제하고, 동일 Rubric으로 채점·피드백·수정 학습까지 진행합니다.</p><Link className="btn" href="/training/ai">AI 훈련 시작</Link></div><div className="card"><h2>오늘의 경험 정리</h2><p>실제 업무 경험을 문제해결 구조로 축적합니다.</p><Link className="btn secondary" href="/experience/new">경험 기록</Link></div></div>
    <div className="grid"><section><h2>최근 Experience</h2><div className="list">{ex?.map(x=><Link className="item" href={`/experience/${x.id}`} key={x.id}>{x.title}</Link>)}</div></section><section><h2>최근 Training</h2><div className="list">{tr?.map(x=><Link className="item" href={`/training/${x.id}`} key={x.id}><strong>{x.title}</strong><span className="muted">{x.training_type}{x.score!=null?` · ${x.score}점`:''}{x.score_delta!=null?` · 개선 ${x.score_delta>=0?'+':''}${x.score_delta}`:''}</span></Link>)}</div></section></div>
  </>
}
