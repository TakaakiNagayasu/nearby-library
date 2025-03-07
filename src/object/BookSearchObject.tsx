import { z } from "zod";

export const bookSearchZodEffect = z
  .object({
    bookTitle: z.string().max(100, "書名は100文字以内で入力してください"),
    author: z.string().max(100, "著者は100文字以内で入力してください"),
    publisher: z.string().max(100, "出版社は100文字以内で入力してください"),
    isbn: z
      .string()
      .refine(
        (val) =>
          /^[0-9]{9}[0-9X]$|^[0-9]{12}[0-9X]$/.test(
            val
          ),
        {
          message:
            "ISBNは10桁または13桁の半角数字（最後の1桁はXも可）で入力してください",
        }
      )
      .or(z.literal("")),
  })
  .refine(
    (data) =>
      data.bookTitle?.trim() !== "" ||
      data.author?.trim() !== "" ||
      data.publisher?.trim() !== "" ||
      data.isbn?.trim() !== "",
    {
      message: "書名、著者、出版社、ISBNのいずれかを入力してください",
      path: ["isbn"],
    }
  );

export type BookSearchZodEffect = typeof bookSearchZodEffect;

export const bookSearchZodObject = bookSearchZodEffect.innerType();

export type BookSearchZodObject = typeof bookSearchZodObject;

export type BookSearch = z.infer<typeof bookSearchZodEffect>;
