'use client';
import ForgotPassword from '@/components/auth/ForgotPassword';
import PrimarySearchAppBar from '@/components/navigation';

export default function ForgotPasswordForm() {
  return (
    <div>
      <PrimarySearchAppBar />
      <ForgotPassword />
    </div>
  );
}
