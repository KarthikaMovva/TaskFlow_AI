import RegisterForm from "@/components/auth/register-form";
import AuthCard from "@/components/auth/auth-card";

export default function RegisterPage() {

    return (

        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-gradient-to-br
                from-white
                via-purple-50
                to-white
            "
        >
            <AuthCard>
                <RegisterForm />
            </AuthCard>
        </main>
    );
}