import Link from 'next/link';
export default function Home(){return <><h1>극소수 v1.1</h1><div className="card"><h2>상위 1% 문제해결 훈련 OS</h2><p>경험을 구조화하고 문제 정의, 가설, 검증, 인사이트, 원리를 개인 데이터베이스에 축적합니다.</p><div className="row"><Link className="btn" href="/signup">회원가입</Link><Link className="btn secondary" href="/login">로그인</Link></div></div></>}
