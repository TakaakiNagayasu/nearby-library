import { z } from "zod";

export const isbnCodesSystemidDetailZodObject = z.object({
  isbnCodes: z
    .string()
    .refine(
      (val) =>
        /^(?:[0-9]{9}[0-9X]|[0-9]{12}[0-9X])(?:,(?:[0-9]{9}[0-9X]|[0-9]{12}[0-9X]))*$/.test(
          val
        ),
      {
        message:
          "ISBNは10桁または13桁の半角数字（最後の1桁はXも可）で入力し、2つ以上指定する場合は「,」で区切ってください",
      }
    ),
  systemidDetail: z
    .string()
    .refine((val) => /^(?:[0-9a-zA-Z_]+)(?:,[0-9a-zA-Z_]+)*$/.test(val), {
      message:
        "システムIDは半角英数字で入力し、2つ以上指定する場合は「,」で区切ってください",
    }),
});

export type IsbnCodesSystemidDetailZodObject =
  typeof isbnCodesSystemidDetailZodObject;

export type IsbnCodesSystemidDetail = z.infer<
  typeof isbnCodesSystemidDetailZodObject
>;
