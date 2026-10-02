'use client';

import { useState } from 'react';
import Link from 'next/link';

type Problem = {
  title:string; training_type:string; difficulty:string; industry:string;
  situation:string; problem_context:string; metrics:string[]; evidence:string[]; task:string; evaluation_focus:string[];
};

type Evaluation = {
  score:number;
  rubric:Record<string,number>;
  strengths:string[];
  critical_errors:string[];
  missing_evidence:string[];
  recommended_revision:string[];
  next_questions:string[];
  feedback_summary:string;
  weakness_tags:string[];
  strength_tags:string[];
};

const rubricLabels:Record<string,string> = {
  problem_definition:'문제 정의', cause_analysis:'원인 분석', evidence:'근거 활용', cause_hypothesis:'원인 가설',
  falsification:'반증 조건', validation:'검증 설계', solution_logic:'해결책 연결성', execution:'실행 가능성'
};

export default function AITrainingPage(){
  const [trainingType,setTrainingType]=useState('marketing');
  const [difficulty,setDifficulty]=useState('intermediate');
  const [industry,setIndustry]=useState('');
  const [problem,setProblem]=useState<Problem|null>(null);
  const [problemDefinition,setProblemDefinition]=useState('');
  const [causeHypothesis,setCauseHypothesis]=useState('');
  const [validationSolution,setValidationSolution]=useState('');
  const [evaluation,setEvaluation]=useState<Evaluation|null>(null);
  const [sessionId,setSessionId]=useState<string|null>(null);
  const [loading,setLoading]=useState('');
  const [error,setError]=useState('');

  async function generateProblem(){
    setLoading('문제를 생성하고 있습니다...'); setError(''); setEvaluation(null); setSessionId(null);
    setProblemDefinition(''); setCauseHypothesis(''); setValidationSolution('');
    try{
      const res=await fetch('/api/training/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({training_type:trainingType,difficulty,industry})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||'문제 생성 실패'); setProblem(data.problem);
    }catch(e:any){setError(e.message)}finally{setLoading('')}
  }

  async function evaluate(revision=false){
    if(!problem) return;
    setLoading(revision?'수정 답안을 재평가하고 있습니다...':'답안을 평가하고 있습니다...'); setError('');
    try{
      const res=await fetch('/api/training/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        problem, problem_definition:problemDefinition, cause_hypothesis:causeHypothesis, validation_solution:validationSolution,
        session_id: revision ? sessionId : null
      })});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||'평가 실패');
      setEvaluation(data.evaluation); setSessionId(data.session_id);
      window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
    }catch(e:any){setError(e.message)}finally{setLoading('')}
  }

  return <>
    <div className="heroRow">
      <div><span className="eyebrow">PHASE 2 · AI COACH</span><h1>AI 문제 해결 훈련</h1><p className="muted">문제를 풀고, 100점 기준 평가와 수정 피드백을 받아 사고과정을 반복 훈련합니다.</p></div>
      <Link className="btn secondary" href="/dashboard">Dashboard</Link>
    </div>

    <section className="card">
      <h2>1. 훈련 문제 설정</h2>
      <div className="formGrid">
        <div><label>훈련 유형</label><select value={trainingType} onChange={e=>setTrainingType(e.target.value)}><option value="business">Business</option><option value="marketing">Marketing</option><option value="geo">GEO</option></select></div>
        <div><label>난이도</label><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="beginner">초급</option><option value="intermediate">중급</option><option value="advanced">고급</option></select></div>
        <div><label>산업 선택</label><input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="비워두면 AI가 임의 선택"/></div>
      </div>
      <button className="btn" onClick={generateProblem} disabled={!!loading}>{problem?'새 문제 생성':'AI 문제 생성'}</button>
    </section>

    {loading && <div className="notice">{loading}</div>}
    {error && <div className="notice error">{error}</div>}

    {problem && <>
      <section className="card problemCard">
        <div className="row spread"><div><span className="badge">{problem.training_type}</span> <span className="badge">{problem.difficulty}</span> <span className="badge">{problem.industry}</span></div></div>
        <h2>{problem.title}</h2>
        <h3>상황</h3><p className="pre">{problem.situation}</p>
        <h3>전제</h3><p className="pre">{problem.problem_context}</p>
        <div className="grid"><div><h3>주어진 지표</h3><ul>{problem.metrics.map((x,i)=><li key={i}>{x}</li>)}</ul></div><div><h3>주어진 근거</h3><ul>{problem.evidence.map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
        <div className="taskBox"><strong>당신의 과제</strong><p>{problem.task}</p></div>
      </section>

      <section className="card">
        <h2>2. 내 답안</h2>
        <label>문제 정의</label>
        <textarea value={problemDefinition} onChange={e=>setProblemDefinition(e.target.value)} placeholder="현상과 원인을 구분하고 기간, Segment, KPI, 기준, Gap, Business Impact를 포함해 문제를 정의하세요."/>
        <label>원인과 가설</label>
        <textarea value={causeHypothesis} onChange={e=>setCauseHypothesis(e.target.value)} placeholder="원인 후보를 구조화하고, 근거를 구분한 뒤 가장 유력한 Cause Hypothesis와 반증 조건을 작성하세요."/>
        <label>검증과 해결</label>
        <textarea value={validationSolution} onChange={e=>setValidationSolution(e.target.value)} placeholder="검증 방법, 대상, KPI, 성공·실패 기준과 원인이 확인됐을 때의 Solution Hypothesis 및 실행안을 작성하세요."/>
        <button className="btn" onClick={()=>evaluate(Boolean(sessionId))} disabled={!!loading}>{sessionId?'수정 답안 재평가':'AI 평가 받기'}</button>
      </section>
    </>}

    {evaluation && <section className="card evaluationCard">
      <span className="eyebrow">AI EVALUATION</span>
      <div className="scoreHero"><strong>{evaluation.score}</strong><span>/ 100</span></div>
      <p className="lead">{evaluation.feedback_summary}</p>
      <h2>세부 점수</h2>
      <div className="rubricGrid">{Object.entries(evaluation.rubric).map(([k,v])=><div className="rubricItem" key={k}><span>{rubricLabels[k]||k}</span><strong>{v}</strong></div>)}</div>
      <div className="grid">
        <div className="feedback good"><h2>강점</h2><ul>{evaluation.strengths.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="feedback bad"><h2>핵심 오류</h2><ul>{evaluation.critical_errors.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
      </div>
      <div className="grid">
        <div className="feedback"><h2>누락 근거</h2><ul>{evaluation.missing_evidence.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="feedback"><h2>개선 방향</h2><ul>{evaluation.recommended_revision.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
      </div>
      <div className="feedback questions"><h2>수정 답안을 위한 질문</h2><ol>{evaluation.next_questions.map((x,i)=><li key={i}>{x}</li>)}</ol></div>
      <div className="row">
        <button className="btn" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>위로 올라가 수정하기</button>
        {sessionId && <Link className="btn secondary" href={`/training/${sessionId}`}>저장된 기록 보기</Link>}
      </div>
    </section>}
  </>;
}
