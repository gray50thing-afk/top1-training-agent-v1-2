import { signUp } from '@/app/actions';
export default function Page(){return <div className="card"><h1>회원가입</h1><form action={signUp}><label>이름</label><input name="name" placeholder="예: 고석균" required/><label>이메일</label><input name="email" type="email" required/><label>비밀번호</label><input name="password" type="password" minLength={6} required/><button className="btn">가입하기</button></form></div>}
