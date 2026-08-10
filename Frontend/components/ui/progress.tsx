"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    colorClassName?: string;
}

export function Progress({ value = 0, className, colorClassName, ...props }: ProgressProps) {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
        <div
            className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}
            {...props}
        >
            <div
                className={cn("h-full bg-purple-600 transition-all duration-300 ease-in-out", colorClassName)}
                style={{ width: `${clampedValue}%` }}
            />
        </div>
    );
}
