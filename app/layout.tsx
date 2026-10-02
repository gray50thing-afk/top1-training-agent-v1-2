import './globals.css';
import Header from '@/components/Header';

export const metadata = { title: '극소수 v1.1', description: 'Top 1% Problem Solving Training OS' };

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return <html lang="ko"><body><Header/><main className="wrap">{children}</main></body></html>;
}
