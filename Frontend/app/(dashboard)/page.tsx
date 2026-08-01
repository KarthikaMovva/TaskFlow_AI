import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


export default function DashboardPage() {

    return (
        <div
            className="
            grid
            gap-6
            md:grid-cols-3
            "
        >
            <Card>
                <CardHeader>
                    <CardTitle>
                        Total Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className="
                        text-3xl
                        font-bold
                        text-purple-700
                        "
                    >
                        12
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Active Tasks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className="
                        text-3xl
                        font-bold
                        "
                    >
                        48
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        AI Health Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className="
                        text-3xl
                        font-bold
                        text-purple-700
                        "
                    >
                        82%
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}