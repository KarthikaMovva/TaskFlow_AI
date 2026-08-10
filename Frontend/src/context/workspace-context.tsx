"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Organization, Workspace, Project } from "@/src/types";
import { organizationApi } from "@/src/api/organization.api";
import { workspaceApi } from "@/src/api/workspace.api";
import { projectApi } from "@/src/api/project.api";
import { useAuth } from "@/src/hooks/use-auth";

interface WorkspaceContextType {
    organizations: Organization[];
    activeOrg: Organization | null;
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    projects: Project[];
    activeProject: Project | null;
    loading: boolean;
    setActiveOrg: (org: Organization) => void;
    setActiveWorkspace: (ws: Workspace) => void;
    setActiveProject: (proj: Project | null) => void;
    refreshOrganizations: () => Promise<void>;
    refreshWorkspaces: () => Promise<void>;
    refreshProjects: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProjectState] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshOrganizations = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const orgs = await organizationApi.getAll();
            setOrganizations(orgs);
            if (orgs.length > 0) {
                if (!activeOrg || !orgs.some(o => o.id === activeOrg.id)) {
                    setActiveOrgState(orgs[0]);
                }
            } else {
                setActiveOrgState(null);
            }
        } catch (err) {
            console.error("Failed to load organizations", err);
        }
    }, [isAuthenticated, activeOrg]);

    const refreshWorkspaces = useCallback(async () => {
        if (!activeOrg) {
            setWorkspaces([]);
            setActiveWorkspaceState(null);
            return;
        }
        try {
            const wss = await workspaceApi.getByOrganization(activeOrg.id);
            setWorkspaces(wss);
            if (wss.length > 0) {
                if (!activeWorkspace || !wss.some(w => w.id === activeWorkspace.id)) {
                    setActiveWorkspaceState(wss[0]);
                }
            } else {
                setActiveWorkspaceState(null);
            }
        } catch (err) {
            console.error("Failed to load workspaces", err);
        }
    }, [activeOrg, activeWorkspace]);

    const refreshProjects = useCallback(async () => {
        if (!activeWorkspace) {
            setProjects([]);
            setActiveProjectState(null);
            return;
        }
        try {
            const projs = await projectApi.getByWorkspace(activeWorkspace.id);
            setProjects(projs);
            if (projs.length > 0) {
                if (!activeProject || !projs.some(p => p.id === activeProject.id)) {
                    setActiveProjectState(projs[0]);
                }
            } else {
                setActiveProjectState(null);
            }
        } catch (err) {
            console.error("Failed to load projects", err);
        }
    }, [activeWorkspace, activeProject]);

    useEffect(() => {
        if (isAuthenticated) {
            setLoading(true);
            refreshOrganizations().finally(() => setLoading(false));
        } else {
            setOrganizations([]);
            setActiveOrgState(null);
            setWorkspaces([]);
            setActiveWorkspaceState(null);
            setProjects([]);
            setActiveProjectState(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (activeOrg) {
            refreshWorkspaces();
        }
    }, [activeOrg]);

    useEffect(() => {
        if (activeWorkspace) {
            refreshProjects();
        }
    }, [activeWorkspace]);

    const setActiveOrg = (org: Organization) => {
        setActiveOrgState(org);
    };

    const setActiveWorkspace = (ws: Workspace) => {
        setActiveWorkspaceState(ws);
    };

    const setActiveProject = (proj: Project | null) => {
        setActiveProjectState(proj);
    };

    return (
        <WorkspaceContext.Provider
            value={{
                organizations,
                activeOrg,
                workspaces,
                activeWorkspace,
                projects,
                activeProject,
                loading,
                setActiveOrg,
                setActiveWorkspace,
                setActiveProject,
                refreshOrganizations,
                refreshWorkspaces,
                refreshProjects,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}
