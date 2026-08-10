"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className="relative w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className={cn("w-full text-left text-sm text-gray-600", className)}>{children}</table>
        </div>
    );
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <thead className={cn("bg-gray-50/80 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500", className)}>{children}</thead>;
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return <tbody className={cn("divide-y divide-gray-100", className)}>{children}</tbody>;
}

export function TableRow({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return <tr onClick={onClick} className={cn("hover:bg-gray-50/60 transition", className)}>{children}</tr>;
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
    return <th className={cn("px-6 py-3 font-semibold", className)}>{children}</th>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return <td className={cn("px-6 py-4 whitespace-nowrap", className)}>{children}</td>;
}
