import { router, publicProcedure } from "../../trpc";
import type { BookSearchZodEffect } from "../../../../object/BookSearchObject";
import { bookSearchZodEffect } from "../../../../object/BookSearchObject";
import { clientEnv } from "../../../../env/schema.mjs";
import type {
  BookItem,
  GoogleBooksApiResponse,
} from "../../../../interface/googleBooksApiInterface";
import { z } from "zod";
import { api } from "../apiInterface";
import { CONSTANTS } from "../../../../config/constants";
import type { IsbnTitleArray } from "../../../../object/IsbnTitleObject";
import type { CheckNameLink } from "../../../../object/CheckNameLinkObject";

export const googleBooksApiRouter = router({
  searchGoogleBooks: publicProcedure
    .input(bookSearchZodEffect)
    .mutation(async ({ input }) => {
      return api<
        GoogleApiKeyZodObject,
        ConvertTypeZodObject,
        GoogleBooksApiResponse,
        CheckNameLink,
        typeof convertCheckNameLink
      >(
        { key: clientEnv.NEXT_PUBLIC_GOOGLE_API_KEY },
        convertInput(input),
        CONSTANTS.GOOGLE_BOOKS_API_URL,
        convertCheckNameLink
      );
    }),

  searchGoogleBook: publicProcedure
    .input(bookSearchZodEffect)
    .mutation(async ({ input }) => {
      return api<
        GoogleApiKeyZodObject,
        ConvertTypeZodObject,
        GoogleBooksApiResponse,
        IsbnTitleArray,
        typeof convertIsbnTitle
      >(
        { key: clientEnv.NEXT_PUBLIC_GOOGLE_API_KEY },
        convertIsbn(input),
        CONSTANTS.GOOGLE_BOOKS_API_URL,
        convertIsbnTitle
      );
    }),
});

const googleApiKeyObject = z.object({
  key: z.string().or(z.undefined()),
});

type GoogleApiKeyZodObject = typeof googleApiKeyObject;

const convertInput = (
  input: z.infer<BookSearchZodEffect>
): z.infer<ConvertTypeZodObject> => ({
  intitle: input.bookTitle,
  inauthor: input.author,
  inpublisher: input.publisher,
  isbn: input.isbn,
});

const convertIsbn = (
  input: z.infer<BookSearchZodEffect>
): z.infer<ConvertTypeZodObject> => ({
  intitle: "",
  inauthor: "",
  inpublisher: "",
  isbn: input.isbn,
});

const convertTypeZodObject = z.object({
  intitle: z.string(),
  inauthor: z.string(),
  inpublisher: z.string(),
  isbn: z.string(),
});

type ConvertTypeZodObject = typeof convertTypeZodObject;

const convertCheckNameLink = (json: GoogleBooksApiResponse): CheckNameLink => {
  return {
    checkboxList: (json.items || [])
      .filter((item: BookItem) => {
        const identifiers = item?.volumeInfo?.industryIdentifiers ?? []
        if (identifiers.length === 0) return false;

        const lastIdentifier = identifiers[identifiers.length - 1]?.identifier;
        return (
          typeof lastIdentifier === "string" &&
          lastIdentifier.match(/^[0-9]{9}[0-9X]$|^[0-9]{12}[0-9X]$/)
        );
      })
      .map((item: BookItem) => ({
        enabled: true,
        checkbox: false,
        name: item.volumeInfo.title || "",
        sub: item.volumeInfo.publisher || "",
        value: 
          item.volumeInfo.industryIdentifiers?.[item.volumeInfo.industryIdentifiers.length - 1]?.identifier || "",
        link: item.volumeInfo.infoLink || "",
      })),
  };
};

const convertIsbnTitle = (json: GoogleBooksApiResponse): IsbnTitleArray => {
  const returnValues: IsbnTitleArray = json.items
    .filter((item: BookItem) => {
      const identifiers = item?.volumeInfo?.industryIdentifiers;
      if (!Array.isArray(identifiers) || identifiers.length === 0) return false;

      const lastIdentifier = identifiers[identifiers.length - 1]?.identifier;
      return (
        typeof lastIdentifier === "string" &&
        lastIdentifier.match(/^[0-9]{9}[0-9X]$|^[0-9]{12}[0-9X]$/)
      );
    })
    .map((item: BookItem) => ({
      title: item.volumeInfo.title,
      isbn: item?.volumeInfo?.industryIdentifiers[
        item?.volumeInfo?.industryIdentifiers?.length - 1
      ]?.identifier,
    }));
  return returnValues;
};
