"use client";

import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, User as UserIcon, Building2, Briefcase, Plus, Trash2, Shield, Mail } from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { useWorkspace } from "@/src/context/workspace-context";
import { organizationApi } from "@/src/api/organization.api";
import { OrganizationMember, Role } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { user } = useAuth();
    const { activeOrg, workspaces, refreshWorkspaces } = useWorkspace();

    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const fetchMembers = async () => {
        if (!activeOrg) return;
        setLoadingMembers(true);
        try {
            const list = await organizationApi.getMembers(activeOrg.id);
            setMembers(list);
        } catch (err) {
            console.error("Failed to load members", err);
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [activeOrg]);

    const handleRoleChange = async (memberId: string, role: Role) => {
        if (!activeOrg) return;
        try {
            await organizationApi.updateMemberRole(activeOrg.id, memberId, role);
            toast.success("Member role updated");
            await fetchMembers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!activeOrg) return;
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            await organizationApi.deleteMember(activeOrg.id, memberId);
            toast.success("Member removed");
            await fetchMembers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to remove member");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                    <SettingsIcon className="text-purple-700" />
                    Application Settings
                </h1>
                <p className="mt-1 text-sm text-gray-500">Configure profile settings, organization members, and workspaces.</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="gap-2">
                        <UserIcon size={16} />
                        <span>User Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="members" className="gap-2">
                        <Building2 size={16} />
                        <span>Org Members</span>
                    </TabsTrigger>
                    <TabsTrigger value="workspaces" className="gap-2">
                        <Briefcase size={16} />
                        <span>Workspaces</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card className="border-gray-200/80 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900">User Profile</CardTitle>
                            <CardDescription>Your personal TaskFlow AI profile information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-lg">
                            <div>
                                <label className="text-xs font-semibold text-gray-700">Full Name</label>
                                <Input value={user?.name || ""} disabled className="mt-1 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700">Email Address</label>
                                <Input value={user?.email || ""} disabled className="mt-1 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700">Account ID</label>
                                <Input value={user?.id || ""} disabled className="mt-1 bg-gray-50 text-xs font-mono" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Org Members Tab */}
                <TabsContent value="members">
                    <Card className="border-gray-200/80 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900">
                                Organization Members ({activeOrg?.name || "Organization"})
                            </CardTitle>
                            <CardDescription>Manage user roles and permissions in this organization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {members.length === 0 ? (
                                <div className="py-8 text-center text-xs text-gray-400">No members found</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                                                                {m.user?.name ? m.user.name[0] : "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-xs">{m.user?.name || "User"}</p>
                                                            <p className="text-[11px] text-gray-500">{m.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={m.role}
                                                        onChange={(e) => handleRoleChange(m.id, e.target.value as Role)}
                                                        options={[
                                                            { label: "Owner", value: "OWNER" },
                                                            { label: "Admin", value: "ADMIN" },
                                                            { label: "Member", value: "MEMBER" },
                                                        ]}
                                                        className="text-xs h-8 w-28"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-500">
                                                    {new Date(m.joinedAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => handleRemoveMember(m.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Workspaces Tab */}
                <TabsContent value="workspaces">
                    <Card className="border-gray-200/80 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900">Workspaces List</CardTitle>
                            <CardDescription>All active workspaces in {activeOrg?.name || "current organization"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {workspaces.map((ws) => (
                                    <div
                                        key={ws.id}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase size={18} className="text-purple-700" />
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{ws.name}</p>
                                                <p className="text-[11px] text-gray-400">Created {new Date(ws.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-purple-100 text-purple-700">Active Workspace</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
