import { z } from "zod";

export const librariesCountZodObject = z.object({
  value: z
    .string()
    .min(1, { message: "検索図書館戸数は必須です" })
    .refine((val) => /^\d+$/.test(val), {
      message: "検索図書館戸数は半角数字のみ入力してください",
    })
    .refine((val) => /^(?:[1-9]|[12]\d|30)$/.test(val), {
      message: "検索図書館戸数は1～30を入力してください",
    }),
});

export type LibrariesCountZodObject = typeof librariesCountZodObject;

export type LibrariesCountObject = z.infer<typeof librariesCountZodObject>;
