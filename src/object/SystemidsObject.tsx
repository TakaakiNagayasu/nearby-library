import { z } from "zod";

export const systemidZodObject = z.object({
  systemid: z
    .string()
    .min(1, { message: "システムIDは必須です" })
    .refine((val) => /^(?:[0-9a-zA-Z_]+)$/.test(val), {
      message: "システムIDの書式が不正です",
    }),
});

export type SystemidZodObject = typeof systemidZodObject;

export type SystemidObject = z.infer<typeof systemidZodObject>;
