'use client';
import SignUp from '@/components/auth/SignUp';
import PrimarySearchAppBar from '@/components/navigation';

export default function Home() {
  return (
    <div>
      <PrimarySearchAppBar />
      <SignUp />
    </div>
  );
}
