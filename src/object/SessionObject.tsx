import { z } from "zod";

export const sessionZodObject = z.object({
  session: z.string().min(1),
});

export type SessionZodObject = typeof sessionZodObject;

export type Session = z.infer<typeof sessionZodObject>;
