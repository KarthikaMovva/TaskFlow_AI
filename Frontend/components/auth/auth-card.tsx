import { Card } from "@/components/ui/card";

export default function AuthCard({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <Card
            className="
                w-full
                max-w-md
                rounded-2xl
                p-8
                shadow-lg
            "
        >
            {children}
        </Card>
    );
}