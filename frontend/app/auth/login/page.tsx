'use client';
import SignIn from '@/components/auth/SignIn';
//import login_handler from '@/utils/handlers/auth/login_handler';
import PrimarySearchAppBar from '@/components/navigation';
import { useState, useEffect } from 'react';

export default function Login() {
  const [windowLoaded, setWindowLoaded] = useState(false);

  const getSignIn = () => {
    return (
      <div>
        <PrimarySearchAppBar />
        <SignIn />
      </div>
    );
  };

  useEffect(() => {
    setWindowLoaded(true);
  }, []);

  if (windowLoaded) return getSignIn();
}
