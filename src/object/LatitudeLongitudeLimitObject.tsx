import { z } from "zod";

export const latitudeLongitudeLimitZodObject = z.object({
  latitude: z
    .number()
    .min(-180, { message: "緯度は必須です" })
    .max(180, { message: "緯度は必須です" }),
    // .refine(
    //   (val) => {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const [integerPart, decimalPart] = val.toString().split(".");
    //     if (decimalPart && decimalPart.length > 7) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "緯度の書式が不正です",
    //   }
    // ),

  longitude: z
    .number()
    .min(-180, { message: "経度は必須です" })
    .max(180, { message: "経度は必須です" }),
    // .refine(
    //   (val) => {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const [integerPart, decimalPart] = val.toString().split(".");
    //     if (decimalPart && decimalPart.length > 7) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "経度の書式が不正です",
    //   }
    //   ),

  limit: z
    .string()
    .min(1, { message: "取得数は必須です" })
    .refine((val) => /^(?:[1-9]|[12]\d|30)$/.test(val), {
      message: "取得数の書式が不正です",
    }),
});

export type LatitudeLongitudeLimitZodObject =
  typeof latitudeLongitudeLimitZodObject;

export type LatitudeLongitudeLimit = z.infer<
  typeof latitudeLongitudeLimitZodObject
>;
