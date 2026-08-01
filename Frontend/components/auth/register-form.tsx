"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import authService from "@/src/services/auth.service";
import { registerSchema, RegisterFormValues } from "@/src/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/hooks/use-auth";

export default function RegisterForm() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/");
        }
    }, [loading, isAuthenticated, router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    async function onSubmit(data: RegisterFormValues) {

        console.log("REGISTER FORM SUBMITTED", data);

        try {

            const response =
                await authService.register(data);

            console.log("REGISTER RESPONSE", response);

            toast.success(
                "Registration successful! Please login."
            );

            router.replace("/login");

        } catch (error: any) {

            console.error(
                "REGISTER ERROR",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to register";

            toast.error(message);

        }
    }

    if (loading || isAuthenticated) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-purple-700">
                    Create Account
                </h1>
                <p className="text-gray-500">
                    Welcome to TaskFlow AI
                </p>
            </div>

            <div>
                <Input placeholder="Full Name" {...register("name")} />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <Input placeholder="Email" {...register("email")} />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Loader2 className="animate-spin text-white" />
                ) : (
                    "Create Account"
                )}
            </Button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-purple-700 hover:underline">
                    Login
                </Link>
            </p>
        </form>
    );
}