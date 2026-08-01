import { z } from "zod";

export const loginSchema = z.object({
    email:
        z.string()
            .email("Invalid email"),

    password:
        z.string()
            .min(6, "Password must contain at least 6 characters")
});

export const registerSchema = z.object({

    name:
        z.string()
            .min(3, "Name required"),

    email:
        z.string()
            .email("Invalid email"),

    password:
        z.string()
            .min(6, "Password must contain at least 6 characters")

});

export type LoginFormValues =
    z.infer<typeof loginSchema>;

export type RegisterFormValues =
    z.infer<typeof registerSchema>;