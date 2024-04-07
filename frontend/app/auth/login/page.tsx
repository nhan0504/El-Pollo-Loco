'use client';
import SignIn from "@/components/auth/SignIn";
import login_handler from "@/utils/handlers/login_handler";

export default function Login() {
    return (
        <SignIn onSubmit={login_handler} />
    )
}