import api from "./client";
import { Organization, OrganizationMember, Role } from "@/src/types";

export const organizationApi = {
    create: async (name: string): Promise<Organization> => {
        const response = await api.post<{ success: boolean; organization: Organization }>("/organizations", { name });
        return response.data.organization;
    },

    getAll: async (): Promise<Organization[]> => {
        const response = await api.get<{ success: boolean; organizations: Organization[] }>("/organizations");
        return response.data.organizations || [];
    },

    getById: async (id: string): Promise<Organization> => {
        const response = await api.get<{ success: boolean; organization: Organization }>(`/organizations/${id}`);
        return response.data.organization;
    },

    getMembers: async (organizationId: string): Promise<OrganizationMember[]> => {
        const response = await api.get<{ success: boolean; members: OrganizationMember[] }>(`/organizations/${organizationId}/members`);
        return response.data.members || [];
    },

    updateMemberRole: async (organizationId: string, memberId: string, role: Role): Promise<OrganizationMember> => {
        const response = await api.patch<{ success: boolean; member: OrganizationMember }>(`/organizations/${organizationId}/members/${memberId}/role`, { role });
        return response.data.member;
    },

    deleteMember: async (organizationId: string, memberId: string): Promise<void> => {
        await api.delete(`/organizations/${organizationId}/members/${memberId}`);
    },
};
