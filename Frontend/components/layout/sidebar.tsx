import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    BrainCircuit,
    Bell,
    Settings
} from "lucide-react";


const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Projects",
        icon: FolderKanban
    },
    {
        name: "Tasks",
        icon: CheckSquare
    },
    {
        name: "AI Insights",
        icon: BrainCircuit
    },
    {
        name: "Notifications",
        icon: Bell
    },
    {
        name: "Settings",
        icon: Settings
    }
];


export default function Sidebar() {

    return (
        <aside
            className="
            hidden
            md:flex
            h-screen
            w-72
            flex-col
            border-r
            bg-white
            "
        >
            {/* Logo */}
            <div
                className="
                flex
                h-16
                items-center
                px-6
                border-b
                "
            >
                <h1
                    className="
                    text-xl
                    font-bold
                    text-purple-700
                    "
                >
                    TaskFlow AI
                </h1>

            </div>
            {/* Navigation */}
            <nav
                className="
                flex-1
                space-y-2
                p-4
                "
            >
                {
                    menuItems.map(
                        (item) => {

                            const Icon =
                                item.icon;


                            return (

                                <button
                                    key={
                                        item.name
                                    }

                                    className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-sm
                                    text-gray-600
                                    hover:bg-purple-50
                                    hover:text-purple-700
                                    transition
                                    "
                                >
                                    <Icon
                                        size={20}
                                    />
                                    {
                                        item.name
                                    }
                                </button>
                            )

                        }
                    )
                }
            </nav>
        </aside>
    );
}