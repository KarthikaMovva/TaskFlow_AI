import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    Bell
} from "lucide-react";


export default function Navbar() {

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
                        HM
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}