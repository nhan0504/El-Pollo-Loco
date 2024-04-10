'use client';
import SignUp from "@/components/auth/SignUp";
import signup_handler from "@/utils/handlers/signup_handler";
import PrimarySearchAppBar from "@/components/navigation";

export default function Home() {
    return (
      <div>
      <PrimarySearchAppBar />
      <SignUp onSubmit={signup_handler} />
      </div>
    );
  }
  
  
  
  