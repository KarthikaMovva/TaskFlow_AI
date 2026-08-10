"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    KanbanSquare,
    CheckSquare,
    BrainCircuit,
    Activity,
    Bell,
    Settings,
    Plus,
    Building2,
    Briefcase,
    ChevronDown,
    Sparkles,
} from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { organizationApi } from "@/src/api/organization.api";
import { workspaceApi } from "@/src/api/workspace.api";
import toast from "react-hot-toast";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Kanban Board", href: "/kanban", icon: KanbanSquare },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "AI Insights", href: "/ai-insights", icon: BrainCircuit, badge: "AI" },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const {
        organizations,
        activeOrg,
        workspaces,
        activeWorkspace,
        setActiveOrg,
        setActiveWorkspace,
        refreshOrganizations,
        refreshWorkspaces,
    } = useWorkspace();

    const [isCreateOrgOpen, setCreateOrgOpen] = useState(false);
    const [newOrgName, setNewOrgName] = useState("");

    const [isCreateWsOpen, setCreateWsOpen] = useState(false);
    const [newWsName, setNewWsName] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgName.trim()) return;
        setIsSubmitting(true);
        try {
            const org = await organizationApi.create(newOrgName.trim());
            toast.success("Organization created successfully");
            setNewOrgName("");
            setCreateOrgOpen(false);
            await refreshOrganizations();
            setActiveOrg(org);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create organization");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateWs = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWsName.trim() || !activeOrg) return;
        setIsSubmitting(true);
        try {
            const ws = await workspaceApi.create(newWsName.trim(), activeOrg.id);
            toast.success("Workspace created successfully");
            setNewWsName("");
            setCreateWsOpen(false);
            await refreshWorkspaces();
            setActiveWorkspace(ws);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create workspace");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <aside className="hidden md:flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-xs">
                {/* Brand Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-700 text-white shadow-md shadow-purple-500/20">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">
                            TaskFlow <span className="text-purple-700">AI</span>
                        </span>
                    </Link>
                </div>

                {/* Organization & Workspace Switcher Section */}
                <div className="p-4 border-b border-gray-100 space-y-2 bg-gray-50/50">
                    {/* Organization selector */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
                            <span>Organization</span>
                            <button
                                onClick={() => setCreateOrgOpen(true)}
                                className="text-purple-700 hover:text-purple-900 transition flex items-center gap-0.5"
                                title="New Organization"
                            >
                                <Plus size={13} />
                                <span>New</span>
                            </button>
                        </div>
                        {organizations.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={activeOrg?.id || ""}
                                    onChange={(e) => {
                                        const org = organizations.find((o) => o.id === e.target.value);
                                        if (org) setActiveOrg(org);
                                    }}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-7 text-xs font-semibold text-gray-800 shadow-xs focus:border-purple-600 focus:outline-none"
                                >
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                <Building2 size={14} className="absolute left-2.5 top-2.5 text-purple-600" />
                                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        ) : (
                            <button
                                onClick={() => setCreateOrgOpen(true)}
                                className="w-full text-left text-xs text-purple-700 font-medium hover:underline p-1"
                            >
                                + Create Organization
                            </button>
                        )}
                    </div>

                    {/* Workspace selector */}
                    <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
                            <span>Workspace</span>
                            {activeOrg && (
                                <button
                                    onClick={() => setCreateWsOpen(true)}
                                    className="text-purple-700 hover:text-purple-900 transition flex items-center gap-0.5"
                                    title="New Workspace"
                                >
                                    <Plus size={13} />
                                    <span>New</span>
                                </button>
                            )}
                        </div>
                        {workspaces.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={activeWorkspace?.id || ""}
                                    onChange={(e) => {
                                        const ws = workspaces.find((w) => w.id === e.target.value);
                                        if (ws) setActiveWorkspace(ws);
                                    }}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-7 text-xs font-semibold text-gray-800 shadow-xs focus:border-purple-600 focus:outline-none"
                                >
                                    {workspaces.map((ws) => (
                                        <option key={ws.id} value={ws.id}>
                                            {ws.name}
                                        </option>
                                    ))}
                                </select>
                                <Briefcase size={14} className="absolute left-2.5 top-2.5 text-purple-600" />
                                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        ) : (
                            <button
                                onClick={() => (activeOrg ? setCreateWsOpen(true) : setCreateOrgOpen(true))}
                                className="w-full text-left text-xs text-purple-700 font-medium hover:underline p-1"
                            >
                                {activeOrg ? "+ Create Workspace" : "Create Organization first"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Navigation Links */}
                <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
                    <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-1">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-purple-50 text-purple-700 font-semibold border-l-4 border-purple-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? "text-purple-700" : "text-gray-400"} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Modal: Create Organization */}
            <Dialog open={isCreateOrgOpen} onOpenChange={setCreateOrgOpen}>
                <DialogContent onClose={() => setCreateOrgOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Create New Organization</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateOrg} className="space-y-4 pt-2">
                        <Input
                            placeholder="Organization Name (e.g. Acme Corp)"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                            required
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateOrgOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
                                Create Organization
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Create Workspace */}
            <Dialog open={isCreateWsOpen} onOpenChange={setCreateWsOpen}>
                <DialogContent onClose={() => setCreateWsOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Create New Workspace</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateWs} className="space-y-4 pt-2">
                        <Input
                            placeholder="Workspace Name (e.g. Product Engineering)"
                            value={newWsName}
                            onChange={(e) => setNewWsName(e.target.value)}
                            required
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateWsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
                                Create Workspace
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}