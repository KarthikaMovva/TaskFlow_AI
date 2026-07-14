import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

/*
    Validation schema for creating a project.
*/
export const createProjectSchema = z.object({

    // Project name
    name: z
        .string()
        .min(3, "Project name must contain at least 3 characters")
        .max(100, "Project name cannot exceed 100 characters"),

    // Optional description
    description: z
        .string()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),

    // Workspace in which project will be created
    workspaceId: z
        .string()
        .uuid("Invalid workspace id"),

    // Optional project status
    status: z
        .nativeEnum(ProjectStatus)
        .optional()

});

export type CreateProjectInput =
    z.infer<typeof createProjectSchema>;

/*
    Validation schema for updating a project.

    All fields are optional because
    the client may update only one field.
*/
export const updateProjectSchema = z.object({

    name: z
        .string()
        .min(3, "Project name must contain at least 3 characters")
        .max(100)
        .optional(),

    description: z
        .string()
        .max(1000)
        .optional(),

    status: z
        .nativeEnum(ProjectStatus)
        .optional()

});

export type UpdateProjectInput =
    z.infer<typeof updateProjectSchema>;