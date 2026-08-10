"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: "left" | "right";
    className?: string;
}

export function Popover({ trigger, children, align = "right", className }: PopoverProps) {
    const [open, setOpen] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={popoverRef}>
            <div onClick={() => setOpen(!open)}>{trigger}</div>

            {open && (
                <div
                    className={cn(
                        "absolute z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in-0 zoom-in-95",
                        align === "right" ? "right-0" : "left-0",
                        className
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
