import { z } from "zod";
import { PASSWORD_REGEX } from "@/constants/index";

const registerSchema = z
  .object({
    firstName: z.string().max(255).min(2),
    lastName: z.string().max(255).min(2),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
});

const newTransactionSchema = z.object({
  name: z.string(),
  date: z.string(),
  category: z.string(),
  amount: z.number().default(0),
  recurring: z.boolean().default(false),
});

export { registerSchema, loginSchema, newTransactionSchema };
