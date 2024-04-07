'use client';
import SignUp from "@/components/auth/SignUp";
import signup_handler from "@/utils/handlers/signup_handler";

export default function Home() {
    return (
      <SignUp onSubmit={signup_handler} />
    );
  }
  
  
  
  