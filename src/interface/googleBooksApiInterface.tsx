import { z } from 'zod';

export const industryIdentifierZodObject = z.object({
  type: z.string().or(z.undefined()),
  identifier: z.string().or(z.undefined()),
});

export const volumeInfoZodObject = z.object({
  title: z.string().or(z.undefined()),
  authors: z.array(z.string()).or(z.undefined()),
  publisher: z.string().or(z.undefined()),
  industryIdentifiers: z.array(industryIdentifierZodObject),
  infoLink: z.string().or(z.undefined()),
});

export const bookItemZodObjectZodObject = z.object({
  volumeInfo: volumeInfoZodObject,
});

export const googleBooksApiResponse = z.object({
  items: z.array(bookItemZodObjectZodObject),
});

export type IndustryIdentifierZodObject = typeof industryIdentifierZodObject;

export type IndustryIdentifier = z.infer<typeof industryIdentifierZodObject>;

export type VolumeInfoZodObject = typeof volumeInfoZodObject;

export type VolumeInfo = z.infer<typeof volumeInfoZodObject>;

export type BookItemZodObject = typeof bookItemZodObjectZodObject;

export type BookItem =  z.infer<typeof bookItemZodObjectZodObject>;

export type GoogleBooksApiResponseZodObject = typeof googleBooksApiResponse;

export type GoogleBooksApiResponse = z.infer<typeof googleBooksApiResponse>;
