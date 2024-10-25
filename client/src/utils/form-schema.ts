import { z } from "zod";

export const formProfileSchema = z.object({
  email: z.string().min(2),
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  bio: z.string().optional(),
  avatar: z.string().min(1),
  password: z.string().optional(),
});

export const formLoginSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email is required!",
    })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
      message: "Invalid Email",
    }),
  password: z.string().min(6, {
    message: "Password is required!",
  }),
});

export const formRegisterSchema = z
  .object({
    first_name: z.string().min(2, {
      message: "First name is required",
    }),
    last_name: z.string().min(2, {
      message: "Last name is required",
    }),
    email: z
      .string()
      .min(2, {
        message: "Email is required!",
      })
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
        message: "Invalid Email",
      }),
    password: z.string().min(6, {
      message: "Password is required!",
    }),
    confirm_password: z.string().min(6, {
      message: "Confirm password is required!",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const formUpdatePasswordSchema = z
  .object({
    email: z
      .string()
      .min(2, {
        message: "Email is required!",
      })
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
        message: "Invalid Email",
      }),
    password: z.string().min(6, {
      message: "Password is required!",
    }),
    new_password: z.string().min(6, {
      message: "New password is required!",
    }),
    confirm_password: z.string().min(6, {
      message: "Confirm new password is required!",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords don't match",
    path: ["confirm_password"],
  })
  .refine((data) => data.password !== data.new_password, {
    message: "New & Old password shouldn't match",
    path: ["new_password"],
  });
