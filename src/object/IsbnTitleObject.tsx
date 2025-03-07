import { z } from "zod";

export const isbnTitleZodObject = z.object({
  isbn: z
    .string()
    .refine((val) => /^[0-9]{9}[0-9X]$|^[0-9]{12}[0-9X]$/.test(val), {
      message:
        "ISBNは10桁または13桁の半角数字（最後の1桁はXも可）で入力してください",
    })
    .or(z.literal(""))
    .or(z.undefined()),
  title: z
    .string()
    .max(100, "書名は100文字以内で入力してください")
    .or(z.undefined()),
});

export type IsbnTitleZodObject = typeof isbnTitleZodObject;

export type IsbnTitle = z.infer<typeof isbnTitleZodObject>;

export const isbnTitleZodObjectArray = z.array(isbnTitleZodObject);

export type IsbnTitleZodObjectArray = typeof isbnTitleZodObjectArray;

export type IsbnTitleArray = z.infer<typeof isbnTitleZodObjectArray>;
