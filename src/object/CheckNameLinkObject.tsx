import { z } from "zod";

export const checkNameLinkZodObject = z.object({
  checkboxList: z
    .array(
      z.object({
        enabled: z.boolean().default(true),
        checkbox: z.boolean(),
        name: z.string().default(""),
        sub: z.string().default(""),
        value: z.string().default(""),
        link: z.string().default(""),
      })
    )
    .refine((items) => items.length > 0, {
      message: "先に検索してください",
      path: ["root"],
    })
    .refine(
      (items) => {
        return items.some((item) => item.checkbox);
      },
      {
        message: "チェックボックスを1つ以上選択してください",
        path: ["root"],
      }
    ),
});

export type CheckNameLinkZodObject = z.infer<typeof checkNameLinkZodObject>;

export type CheckNameLink = z.infer<typeof checkNameLinkZodObject>;
