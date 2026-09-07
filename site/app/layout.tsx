import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'คลังคู่มือดิจิทัล | สำนักวิจัยและส่งเสริมวิชาการการเกษตร', description: 'แค็ตตาล็อกคู่มือ มหาวิทยาลัยแม่โจ้' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body>{children}</body></html>; }
