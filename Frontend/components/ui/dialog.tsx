"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50 w-full max-w-lg p-4">{children}</div>
        </div>
    );
}

export function DialogContent({
    children,
    className,
    onClose,
}: {
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
}) {
    return (
        <div
            className={cn(
                "relative w-full rounded-xl border bg-white p-6 shadow-xl space-y-4 animate-in fade-in-0 zoom-in-95",
                className
            )}
        >
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                    <X size={18} />
                </button>
            )}
            {children}
        </div>
    );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-1.5 text-left", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h2 className={cn("text-xl font-bold text-gray-900", className)}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex justify-end gap-3 pt-4 border-t border-gray-100", className)}>{children}</div>;
}
