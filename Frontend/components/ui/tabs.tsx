"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface TabsContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export function Tabs({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
}: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (val: string) => void;
    children: React.ReactNode;
    className?: string;
}) {
    const [selectedTab, setSelectedTab] = React.useState(value || defaultValue || "");

    const activeTab = value !== undefined ? value : selectedTab;

    const setActiveTab = (tab: string) => {
        if (value === undefined) {
            setSelectedTab(tab);
        }
        if (onValueChange) {
            onValueChange(tab);
        }
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-500",
                className
            )}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;

    return (
        <button
            type="button"
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-purple-700 shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.activeTab !== value) return null;

    return <div className={cn("mt-4 animate-in fade-in-50", className)}>{children}</div>;
}
