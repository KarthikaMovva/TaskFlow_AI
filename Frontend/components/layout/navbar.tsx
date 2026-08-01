"use client";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    Bell,
    LogOut
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        router.replace("/login");
    };

    return (
        <header
            className="
            flex
            h-16
            items-center
            justify-between
            border-b
            bg-white
            px-6
            "
        >
            <h2
                className="
                text-lg
                font-semibold
                text-gray-800
                "
            >
                Workspace
            </h2>
            <div
                className="
                flex
                items-center
                gap-5
                "
            >
                <Bell
                    className="
                    text-gray-500
                    cursor-pointer
                    hover:text-gray-700
                    "
                    size={20}
                />
                <Avatar>
                    <AvatarFallback
                        className="
                        bg-purple-100
                        text-purple-700
                        "
                    >
                        TF
                    </AvatarFallback>
                </Avatar>
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-1.5
                    text-sm
                    text-gray-600
                    hover:bg-red-50
                    hover:text-red-600
                    transition
                    "
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}