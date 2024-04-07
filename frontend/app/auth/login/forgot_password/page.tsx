'use client';
import ForgotPassword from "@/components/auth/ForgotPassword";
import forgot_password_handler from "@/utils/handlers/forgot_password_handler";

export default function ForgotPasswordForm() {
    return (
        <ForgotPassword onSubmit={forgot_password_handler} />
    )
}