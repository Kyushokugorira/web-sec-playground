import { z } from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(5),
  otp: z.string().min(4),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
