import LoginForm from "@/components/auth/login-form";
import AuthCard from "@/components/auth/auth-card";

export default function LoginPage() {

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
                <LoginForm />
            </AuthCard>
        </main>
    );
}