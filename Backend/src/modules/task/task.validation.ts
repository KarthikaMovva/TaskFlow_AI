import { z } from "zod";

import {
    Priority,
    TaskStatus
} from "@prisma/client";


/*
    Validation schema
    for creating tasks.
*/

export const createTaskSchema = z.object({


    /*
        Task title
    */
    title: z
        .string()
        .min(
            3,
            "Task title must contain at least 3 characters"
        )
        .max(
            200,
            "Task title cannot exceed 200 characters"
        ),



    /*
        Optional details
    */
    description: z
        .string()
        .max(
            2000,
            "Description too long"
        )
        .optional(),



    /*
        Project where task belongs
    */
    projectId: z
        .string()
        .uuid(
            "Invalid project id"
        ),



    /*
        Task priority
    */
    priority: z
        .nativeEnum(Priority)
        .optional(),



    /*
        Optional deadline
    */
    dueDate: z
        .string()
        .datetime()
        .optional()


});


export type CreateTaskInput =

    z.infer<typeof createTaskSchema>;

/*
    Update task validation

    All fields optional because
    PATCH updates partially.
*/

export const updateTaskSchema = z.object({


    title: z
        .string()
        .min(3)
        .max(200)
        .optional(),



    description: z
        .string()
        .max(2000)
        .optional(),



    status: z
        .nativeEnum(TaskStatus)
        .optional(),



    priority: z
        .nativeEnum(Priority)
        .optional(),



    dueDate: z
        .string()
        .datetime()
        .optional()


});


export type UpdateTaskInput =

    z.infer<typeof updateTaskSchema>;

/*
    Assign task validation
*/

export const assignTaskSchema = z.object({

    assignedToId:

        z.string()
            .uuid(
                "Invalid user id"
            )

});


export type AssignTaskInput =

    z.infer<typeof assignTaskSchema>;

export const reorderTasksSchema = z.object({

    taskIds: z
        .array(z.string().uuid())
        .min(1)

});

export type ReorderTasksInput =
    z.infer<typeof reorderTasksSchema>;