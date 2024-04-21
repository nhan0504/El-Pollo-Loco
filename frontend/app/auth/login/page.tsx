'use client';
import SignIn from '@/components/auth/SignIn';
import login_handler from '@/utils/handlers/auth/login_handler';
import PrimarySearchAppBar from '@/components/navigation';

export default function Login() {
  return (
    <div>
      <PrimarySearchAppBar />
      <SignIn />
    </div>
  );
}