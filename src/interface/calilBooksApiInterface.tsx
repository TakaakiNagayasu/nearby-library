import { z } from "zod";

export const systemidDetailZodObject = z.object({
  libkey: z.map(z.string(), z.string()),
  reserveurl: z.string().or(z.undefined()),
  status: z.string().or(z.undefined()),
  error: z.string().or(z.undefined()),
});

export const calilBooksApiResponseZodObject = z.object({
  session: z.string(),
  books: z.map(z.string(), z.map(z.string(), systemidDetailZodObject)),
  continue: z.number(),
});

export const systemidDetailZodObjectArrayZodObject = z.array(systemidDetailZodObject);

export type SystemidDetailZodObjectArray = z.infer<
  typeof systemidDetailZodObjectArrayZodObject
>;

export type SystemidDetailZodObject = typeof systemidDetailZodObject;

export type SystemidDetail = z.infer<typeof systemidDetailZodObject>;

export const calilBooksApiResponseArrayZodObject = z.array(
  calilBooksApiResponseZodObject
);

export type CalilBooksApiResponseArray = z.infer<
  typeof calilBooksApiResponseArrayZodObject
>;

export type CalilBooksApiResponseZodObject =
  typeof calilBooksApiResponseZodObject;

export type CalilBooksApiResponse = z.infer<
  typeof calilBooksApiResponseZodObject
>;
