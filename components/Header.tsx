import Link from 'next/link';
import { signOut } from '@/app/actions';

export default function Header() {
  return <header className="nav"><div className="wrap"><Link href="/"><strong>극소수 v1.2</strong></Link><nav className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/experience/new">오늘의 경험 정리</Link><Link href="/training/ai">AI Training</Link><Link href="/training/new">Manual Training</Link><form action={signOut}><button className="btn secondary" type="submit">Logout</button></form></nav></div></header>
}
