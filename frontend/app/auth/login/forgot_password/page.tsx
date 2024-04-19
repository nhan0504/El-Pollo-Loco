'use client';
import ForgotPassword from "@/components/auth/ForgotPassword";
import forgot_password_handler from "@/utils/handlers/auth/forgot_password_handler";
import PrimarySearchAppBar from "@/components/navigation";

export default function ForgotPasswordForm() {
    return (
        <div>
        <PrimarySearchAppBar />
        <ForgotPassword onSubmit={forgot_password_handler} />
        </div>
    )
}